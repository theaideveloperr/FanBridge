import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import stadiumData from './src/data/stadiumData.json' with { type: 'json' };

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

let model = null;
if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  console.log('✅ Gemini API client initialized on Proxy Server (Key is secure & hidden from browser)');
} else {
  console.warn('⚠️ GEMINI_API_KEY not found in environment. Server operating in fallback mode.');
}

const STADIUM_CONTEXT = JSON.stringify(stadiumData, null, 2);

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  hi: 'हिन्दी',
};

/* ─── Helper Functions ─── */

function extractSources(text, question = '') {
  const combined = `${question} ${text}`.toLowerCase();
  const sources = new Set();

  stadiumData.sections.forEach(sec => {
    if (combined.includes(`section ${sec.id}`) || combined.includes(`sección ${sec.id}`) || combined.includes(`seção ${sec.id}`) || combined.includes(`${sec.id}`)) {
      sources.add(`Section ${sec.id} (Level ${sec.level})`);
      const gate = stadiumData.gates.find(g => g.id === sec.nearestGate);
      if (gate) sources.add(`${gate.name}`);
    }
  });

  stadiumData.gates.forEach(gate => {
    const gateLetter = gate.id.toLowerCase();
    if (combined.includes(`gate ${gateLetter}`) || combined.includes(`puerta ${gateLetter}`) || combined.includes(`portão ${gateLetter}`)) {
      sources.add(gate.name);
    }
  });

  stadiumData.amenities.forEach(amenity => {
    const nameLower = amenity.name.toLowerCase();
    if (combined.includes(nameLower) || (combined.includes('medical') && amenity.type === 'medical') || (combined.includes('restroom') && amenity.type.includes('restroom'))) {
      sources.add(amenity.name);
    }
  });

  if (sources.size === 0) {
    sources.add(`${stadiumData.stadiumName} Directory`);
  }

  return Array.from(sources);
}

function resolveLocationFromData(rawLocationText) {
  if (!rawLocationText) return 'Unconfirmed location';
  const text = rawLocationText.toLowerCase();

  const secMatch = text.match(/section\s*(\d+)|sección\s*(\d+)|seção\s*(\d+)/i);
  if (secMatch) {
    const secId = secMatch[1] || secMatch[2] || secMatch[3];
    const sec = stadiumData.sections.find(s => s.id === secId);
    if (sec) {
      const g = stadiumData.gates.find(gate => gate.id === sec.nearestGate);
      return `Section ${sec.id} (Near ${g ? g.name : 'Gate ' + sec.nearestGate})`;
    }
  }

  const gateMatch = text.match(/gate\s*([a-h])|puerta\s*([a-h])|portão\s*([a-h])/i);
  if (gateMatch) {
    const gId = (gateMatch[1] || gateMatch[2] || gateMatch[3]).toUpperCase();
    const gate = stadiumData.gates.find(g => g.id === gId);
    if (gate) return gate.name;
  }

  for (const amenity of stadiumData.amenities) {
    if (text.includes(amenity.name.toLowerCase())) {
      return `${amenity.name} (Gate ${amenity.nearestGate})`;
    }
  }

  return 'Unconfirmed location';
}

/* ─── Health Check Endpoint ─── */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    proxyServer: 'FanBridge Secure API Proxy',
    keyConfigured: Boolean(API_KEY),
  });
});

/* ─── 1. Fan Chat Endpoint ─── */
app.post('/api/chat', async (req, res) => {
  const { question, language = 'en', accessibilityMode = false } = req.body;
  const langName = LANGUAGE_NAMES[language] || 'English';

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const accessibilityInstruction = accessibilityMode
    ? `CRITICAL ACCESSIBILITY REQUIREMENT (MODE IS ON):
       - You MUST explicitly highlight wheelchair accessible gates (Gate A, Gate C, Gate E, Gate G).
       - You MUST explicitly mention accessible restrooms nearby.
       - Warn if a nearest gate is not step-free, and provide the accessible alternative entrance.
       - Use step-free routing language in your directions.`
    : '';

  const prompt = `You are a helpful AI stadium navigator at "${stadiumData.stadiumName}" for FIFA World Cup 2026.

STADIUM DATA (SINGLE SOURCE OF TRUTH):
${STADIUM_CONTEXT}

RULES:
1. Ground ALL answers in the stadium data. Cite real gate names (e.g. Gate A - North), section numbers (e.g. Section 214), and amenity names.
2. LANGUAGE RULE: You MUST write your ENTIRE response in ${langName}. Do not default to English unless selected language is English.
3. Provide step-by-step numbered instructions.
4. If asked about a gate, section, or amenity that is NOT in stadiumData.json (e.g. Gate Z, Section 999), state clearly that it does not exist in the stadium database.
${accessibilityInstruction}

User Question: "${question}"

Respond now in ${langName}:`;

  if (model) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const sources = extractSources(responseText, question);
      return res.json({
        text: responseText,
        respondedLanguage: langName,
        sources,
        serverProxied: true,
      });
    } catch (err) {
      console.error('Proxy Gemini API error:', err);
      // Fallback to mock
      return res.json(generateMockFanResponse(question, language, accessibilityMode));
    }
  }

  return res.json(generateMockFanResponse(question, language, accessibilityMode));
});

/* ─── 2. Staff Triage Endpoint ─── */
app.post('/api/triage', async (req, res) => {
  const { incidentText } = req.body;
  if (!incidentText) {
    return res.status(400).json({ error: 'Incident text is required' });
  }

  const prompt = `You are an AI incident triage officer at "${stadiumData.stadiumName}".

STADIUM DATA:
${STADIUM_CONTEXT}

Incident Report:
"${incidentText}"

Analyze this incident and return ONLY a valid JSON object with these exact fields:
{
  "category": "medical" | "crowd" | "security" | "facilities",
  "priority": "high" | "medium" | "low",
  "rawLocation": "<extracted gate or section string from text, or null>",
  "summary": "<one sentence concise summary>"
}

Return ONLY raw JSON:`;

  if (model) {
    try {
      const result = await model.generateContent(prompt);
      const textText = result.response.text().trim();
      const cleaned = textText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const parsed = JSON.parse(cleaned);
      const matchedLocation = resolveLocationFromData(parsed.rawLocation || incidentText);
      return res.json({
        category: parsed.category || 'facilities',
        priority: parsed.priority || 'medium',
        location: matchedLocation,
        matchedLocation: matchedLocation,
        summary: parsed.summary,
        serverProxied: true,
      });
    } catch (err) {
      console.error('Proxy Triage Gemini error:', err);
      return res.json(generateMockTriage(incidentText));
    }
  }

  return res.json(generateMockTriage(incidentText));
});

/* ─── 3. Staff Situation Summary Endpoint ─── */
app.post('/api/summary', async (req, res) => {
  const { incidents = [] } = req.body;

  if (incidents.length === 0) {
    return res.json({
      summary: 'All clear across Continental Arena. No active incidents currently reported by staff.',
      serverProxied: true,
    });
  }

  const incidentList = incidents
    .map((inc, i) => `${i + 1}. [${inc.priority.toUpperCase()}] ${inc.category.toUpperCase()}: ${inc.summary} (Location: ${inc.location || 'Unconfirmed'})`)
    .join('\n');

  const prompt = `You are an AI Command Center Supervisor at "${stadiumData.stadiumName}".

Active Incidents (${incidents.length} total):
${incidentList}

Write a 1-2 sentence executive operational situation summary highlighting high priority items, key affected areas, and staff deployment status. Professional tone.`;

  if (model) {
    try {
      const result = await model.generateContent(prompt);
      return res.json({
        summary: result.response.text().trim(),
        serverProxied: true,
      });
    } catch (err) {
      console.error('Proxy Summary Gemini error:', err);
      return res.json({ summary: generateMockSummary(incidents) });
    }
  }

  return res.json({ summary: generateMockSummary(incidents) });
});

/* ─── Mock Fallback Generator ─── */
function generateMockFanResponse(question, language = 'en', accessibilityMode = false) {
  const q = question.toLowerCase();
  const langName = LANGUAGE_NAMES[language] || 'English';

  const unknownGateMatch = q.match(/gate\s*([i-z])|puerta\s*([i-z])|portão\s*([i-z])/i);
  if (unknownGateMatch) {
    const fakeLetter = (unknownGateMatch[1] || unknownGateMatch[2] || unknownGateMatch[3]).toUpperCase();
    const unknownResponses = {
      en: `⚠️ I do not have information for **Gate ${fakeLetter}** in the stadium directory for ${stadiumData.stadiumName}. Valid gates are **Gates A through H**.`,
      es: `⚠️ No tengo información para la **Puerta ${fakeLetter}** en el directorio del estadio ${stadiumData.stadiumName}. Las puertas válidas son de la **A a la H**.`,
      pt: `⚠️ Não tenho informações sobre o **Portão ${fakeLetter}** no diretório do ${stadiumData.stadiumName}. Os portões válidos são de **A a H**.`,
      hi: `⚠️ मेरे पास ${stadiumData.stadiumName} के डेटाबेस में **गेट ${fakeLetter}** की जानकारी नहीं है। केवल गेट A से H तक उपलब्ध हैं।`,
    };
    return {
      text: unknownResponses[language] || unknownResponses.en,
      respondedLanguage: langName,
      sources: [`Unrecognized Entry (${fakeLetter})`],
      serverProxied: false,
    };
  }

  const sectionMatch = q.match(/section\s*(\d+)|sección\s*(\d+)|seção\s*(\d+)/i);
  const sectionId = sectionMatch ? (sectionMatch[1] || sectionMatch[2] || sectionMatch[3]) : null;

  if (sectionId) {
    const section = stadiumData.sections.find(s => s.id === sectionId);
    if (section) {
      const gate = stadiumData.gates.find(g => g.id === section.nearestGate);

      let accessNote = '';
      if (accessibilityMode) {
        if (gate.accessible) {
          accessNote = {
            en: `\n\n♿ **Accessibility Route**: Gate ${gate.id} is fully step-free with elevator access to Level ${section.level}. Accessible restrooms are available inside Gate ${gate.id}.`,
            es: `\n\n♿ **Ruta Accesible**: La Puerta ${gate.id} es totalmente libre de escalones con acceso en ascensor al Nivel ${section.level}. Hay baños accesibles dentro de la Puerta ${gate.id}.`,
            pt: `\n\n♿ **Rota Acessível**: O Portão ${gate.id} é totalmente sem degraus, com elevador para o Nível ${section.level}. Banheiros acessíveis disponíveis no Portão ${gate.id}.`,
            hi: `\n\n♿ **सुलभ मार्ग**: गेट ${gate.id} पूरी तरह से सीढ़ी-मुक्त है और स्तर ${section.level} के लिए लिफ्ट की सुविधा उपलब्ध है।`,
          }[language] || '';
        } else {
          accessNote = {
            en: `\n\n♿ **Accessibility Route**: Gate ${gate.id} has stairs. Please use **Gate A - North (Accessible)** for step-free ramp and elevator access to Section ${section.id}.`,
            es: `\n\n♿ **Ruta Accesible**: La Puerta ${gate.id} tiene escaleras. Utilice la **Puerta A - Norte (Accesible)** para rampas y elevadores sin escalones.`,
            pt: `\n\n♿ **Rota Acessível**: O Portão ${gate.id} tem escadas. Use o **Portão A - Norte (Acessível)** para rampas e elevadores.`,
            hi: `\n\n♿ **सुलभ मार्ग**: गेट ${gate.id} में सीढ़ियां हैं। कृपया सीढ़ी-मुक्त पहुंच के लिए **गेट A - उत्तर (सुलभ)** का उपयोग करें।`,
          }[language] || '';
        }
      }

      const responses = {
        en: `📍 **Section ${section.id}** is located on the **${section.level} Level** (Seats ${section.seatRange}).\n\n**Directions:**\n1. Proceed to **${gate.name}**\n2. Scan ticket at Main Concourse\n3. Take stairs/elevators to ${section.level} Level\n4. Look for aisle signs for Section ${section.id}${accessNote}`,
        es: `📍 **Sección ${section.id}** está ubicada en el **Nivel ${section.level === 'Lower' ? 'Inferior' : 'Superior'}** (Asientos ${section.seatRange}).\n\n**Instrucciones:**\n1. Diríjase a **${gate.name}**\n2. Escanee su entrada en la entrada principal\n3. Tome las escaleras/ascensores hacia el Nivel ${section.level === 'Lower' ? 'Inferior' : 'Superior'}\n4. Siga las señales hacia la Sección ${section.id}${accessNote}`,
        pt: `📍 **Seção ${section.id}** está localizada no **Nível ${section.level === 'Lower' ? 'Inferior' : 'Superior'}** (Assentos ${section.seatRange}).\n\n**Instruções:**\n1. Vá até o **${gate.name}**\n2. Valide seu ingresso na entrada principal\n3. Suba/desça para o Nível ${section.level === 'Lower' ? 'Inferior' : 'Superior'}\n4. Siga as placas até a Seção ${section.id}${accessNote}`,
        hi: `📍 **सेक्शन ${section.id}** **${section.level === 'Lower' ? 'निचले' : 'ऊपरी'} स्तर** (सीटें ${section.seatRange}) पर स्थित है।\n\n**दिशा-निर्देश:**\n1. **${gate.name}** की ओर जाएं\n2. मुख्य प्रवेश द्वार पर टिकट स्कैन करें\n3. ${section.level === 'Lower' ? 'निचले' : 'ऊपरी'} स्तर के लिए मार्ग लें\n4. सेक्शन ${section.id} के संकेतों का पालन करें${accessNote}`,
      };

      return {
        text: responses[language] || responses.en,
        respondedLanguage: langName,
        sources: [`${gate.name}`, `Section ${section.id} (${section.level} Level)`],
        serverProxied: false,
      };
    }
  }

  const defaultText = {
    en: `Welcome to **${stadiumData.stadiumName}**! 🏟️\n\nI can provide directions to sections, gates, medical stations, restrooms, and food stands.`,
    es: `¡Bienvenido a **${stadiumData.stadiumName}**! 🏟️\n\nPuedo darte indicaciones para llegar a secciones, puertas, puestos médicos, baños y comida.`,
    pt: `Bem-vindo ao **${stadiumData.stadiumName}**! 🏟️\n\nPosso fornecer direções para seções, portões, estações médicas, banheiros e lanchonetes.`,
    hi: `**${stadiumData.stadiumName}** में आपका स्वागत है! 🏟️\n\nमैं आपको सेक्शन, गेट, चिकित्सा केंद्र, और शौचालयों के रास्ते बता सकता हूं।`,
  }[language] || defaultText.en;

  return {
    text: defaultText,
    respondedLanguage: langName,
    sources: [`${stadiumData.stadiumName} Directory`],
    serverProxied: false,
  };
}

function generateMockTriage(incidentText) {
  const matchedLocation = resolveLocationFromData(incidentText);
  return {
    category: 'facilities',
    priority: 'low',
    location: matchedLocation,
    matchedLocation: matchedLocation,
    summary: `Incident reported at ${matchedLocation}.`,
    serverProxied: false,
  };
}

function generateMockSummary(incidents) {
  return `${incidents.length} active incident(s) currently monitored by staff.`;
}

app.listen(PORT, () => {
  console.log(`🚀 FanBridge API Proxy Server listening securely on http://localhost:${PORT}`);
});
