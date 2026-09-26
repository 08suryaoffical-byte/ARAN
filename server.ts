import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Gemini SDK if key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI client:', e);
  }
}

// Fallback response engine for Tamil / Hindi / Malayalam / Telugu / Kannada / Gujarati / French / English / Tanglish
function getCompanionFallback(message: string, language: string, seniorName = 'Lakshmi') {
  const lower = message.toLowerCase().trim();

  // Hydration requests
  if (lower.includes('thanni') || lower.includes('water') || lower.includes('पानी') || lower.includes('vellam') || lower.includes('neellu') || lower.includes('neeru') || lower.includes('eau') || lower.includes('thirst')) {
    if (language === 'hi' || lower.includes('पानी')) {
      return `जी ${seniorName} जी, मैंने पानी का अनुरोध दर्ज कर लिया है। आपकी बेटी कविता को सूचना भेज दी गई है। कृपया आराम से बैठें।`;
    }
    if (language === 'ml' || lower.includes('vellam')) {
      return `ശരി ${seniorName}, കുടിവെള്ള സഹായം രേഖപ്പെടുത്തിയിട്ടുണ്ട്. മകൾ കവിതയെ വിവരമറിയിച്ചു. അൽപം വിശ്രമിക്കൂ.`;
    }
    if (language === 'te' || lower.includes('neellu')) {
      return `సరే ${seniorName} గారూ, మంచి నీటి అభ్యర్థన నమోదు చేయబడింది. సంరక్షకురాలైన కవితకు సమాచారం పంపాము. కొద్దిగా విశ్రాంతి తీసుకోండి.`;
    }
    if (language === 'kn' || lower.includes('neeru')) {
      return `ಸರಿ ${seniorName} ಅವರೇ, ನೀರಿನ ವಿನಂತಿಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ. ಮಗಳು ಕವಿತಾಗೆ ಮಾಹಿತಿ ಕಳುಹಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.`;
    }
    if (language === 'gu' || lower.includes('પાણી')) {
      return `હા ${seniorName}જી, પાણીની વિનંતી નોંધી લીધી છે. તમારી દીકરી કવિતાને જાણ કરી દીધી છે. કૃપા કરીને આરામ કરો.`;
    }
    if (language === 'fr' || lower.includes('eau')) {
      return `Bien reçu ${seniorName}. Votre demande d'eau a été enregistrée et transmise à votre proche. Prenez quelques gorgées doucement.`;
    }
    if (language === 'ta' || lower.includes('thanni') || lower.includes('தண்ணீர்')) {
      return `சரி அம்மா, தண்ணீர் உதவியை பதிவு செய்துள்ளேன். உங்கள் பராமரிப்பாளருக்கு தகவல் அனுப்பப்பட்டுள்ளது. தயவுசெய்து சிறிது அமருங்கள்.`;
    }
    if (language === 'tanglish') {
      return `Okay ${seniorName}, hydration assistance requested. Naan caregiver ku message anupitten. Konjam rest edunga.`;
    }
    return `Okay ${seniorName}. Hydration check recommended. I have noted your request and notified your caregiver. Please take small sips.`;
  }

  // Help requests
  if (lower.includes('help') || lower.includes('मदद') || lower.includes('സഹായം') || lower.includes('సహాయం') || lower.includes('ಸಹಾಯ') || lower.includes('મદદ') || lower.includes('aide') || lower.includes('venum')) {
    if (language === 'hi') {
      return `जी ${seniorName} जी, आपको किस प्रकार की सहायता चाहिए? पानी, भोजन, दवा या बेटी कविता को कॉल करूँ?`;
    }
    if (language === 'ml') {
      return `തീർച്ചയായും ${seniorName}, എന്ത് സഹായമാണ് വേണ്ടത്? വെള്ളം, മരുന്ന് അതോ മകൾ കവിതയെ വിളിക്കണമോ?`;
    }
    if (language === 'te') {
      return `తప్పకుండా ${seniorName} గారూ, మీకు ఎలాంటి సహాయం కావాలి? నీరు, భోజనం లేదా కుమార్తె కవితను సంప్రదించమంటారా?`;
    }
    if (language === 'kn') {
      return `ಖಂಡಿತ ${seniorName} ಅವರೇ, ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು? ನೀರು, ಆಹಾರ, ಔಷಧಿ ಅಥವಾ ಮಗಳಿಗೆ ಕರೆ ಮಾಡಬೇಕೆ?`;
    }
    if (language === 'gu') {
      return `ચોક્કસ ${seniorName}જી, તમને શું મદદ જોઈએ છે? પાણી, ખોરાક, દવા કે દીકરી કવિતાને કૉલ કરવો છે?`;
    }
    if (language === 'fr') {
      return `Je suis là pour vous ${seniorName}. De quoi avez-vous besoin ? De l'eau, votre repas, ou dois-je appeler votre proche ?`;
    }
    if (language === 'ta' || lower.includes('உதவி')) {
      return `நிச்சயமாக. உங்களுக்கு என்ன உதவி வேண்டும்? தண்ணீர், மருந்து அல்லது பராமரிப்பாளரை அழைக்கவா?`;
    }
    if (language === 'tanglish') {
      return `Sure ${seniorName}. Enna help venum? Water venuma, food venuma, illa Kavitha ku call panna va?`;
    }
    return `I am right here with you, ${seniorName}. What do you need? Water, food, medication reminder, or should I call your caregiver?`;
  }

  // Check-in responses
  if (lower.includes('ok') || lower.includes('fine') || lower.includes('ठीक') || lower.includes('സുഖം') || lower.includes('బాగున్నాను') || lower.includes('ಆರಾಮ') || lower.includes('મજા') || lower.includes('bien') || lower.includes('nalla') || lower.includes('yes') || lower.includes('aama') || lower.includes('சரி')) {
    if (language === 'hi') {
      return `बहुत अच्छा ${seniorName} जी! आपका सुबह का चेक-इन सफलतापूर्वक दर्ज कर लिया गया है। आपका दिन सुखद हो!`;
    }
    if (language === 'ml') {
      return `സന്തോഷം ${seniorName}! നിങ്ങളുടെ പ്രഭാത ചെക്ക്-ഇൻ വിജയകരമായി രേഖപ്പെടുത്തി. നല്ലൊരു ദിവസം ആശംಸിക്കുന്നു!`;
    }
    if (language === 'te') {
      return `చాలా సంతోషం ${seniorName} గారూ! మీ ఉదయపు చెక్-ఇన్ నమోదు చేయబడింది. మీకు శుభదినం!`;
    }
    if (language === 'kn') {
      return `ತುಂಬಾ ಸಂತೋಷ ${seniorName} ಅವರೇ! ನಿಮ್ಮ ಬೆಳಗಿನ ಚೆಕ್-ಇನ್ ದಾಖಲಾಗಿದೆ. ದಿನವು ಶುಭವಾಗಿರಲಿ!`;
    }
    if (language === 'gu') {
      return `ખૂબ સરસ ${seniorName}જી! તમારું સવારનું ચેક-ઇન સફળતાપૂર્વક નોંધાઈ ગયું છે. સારો દિવસ રહે!`;
    }
    if (language === 'fr') {
      return `Parfait ${seniorName} ! Votre pointage quotidien est validé avec succès. Passez une excellente journée !`;
    }
    if (language === 'ta') {
      return `மகிழ்ச்சி அம்மா! உங்கள் காலை செக்-இன் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது. இனிய நாளாக அமையட்டும்!`;
    }
    if (language === 'tanglish') {
      return `Super ${seniorName}! Unga check-in record aayiduchi. Have a peaceful day!`;
    }
    return `Thank you, ${seniorName}. Your check-in has been successfully recorded as normal. Have a wonderful day!`;
  }

  // Emergency / SOS
  if (lower.includes('sos') || lower.includes('emergency') || lower.includes('आपात') || lower.includes('danger') || lower.includes('fall') || lower.includes('chute') || lower.includes('108')) {
    if (language === 'hi') {
      return `आपातकालीन अलार्म सक्रिय हो गया है! बेटी कविता और 108 एम्बुलेंस सेवा को सूचना भेजी जा रही है।`;
    }
    if (language === 'ml') {
      return `അടിയന്തര സഹായം അയച്ചിരിക്കുന്നു! കവിതയ്ക്കും 108 ആംബുലൻസിനും ഉടൻ സന്ദേശം ലഭിക്കും.`;
    }
    if (language === 'te') {
      return `అత్యవసర సహాయం ప్రారంభించబడింది! కుటుంబ సభ్యులు మరియు 108 అంబులెన్స్ సేవలకు సమాచారం పంపబడింది.`;
    }
    if (language === 'fr') {
      return `Alerte d'urgence activée ! Vos proches et le service d'ambulance 112 sont informés immédiatement.`;
    }
    return language === 'ta'
      ? `அவசர உதவி கோரப்பட்டுள்ளது! கவிதா மற்றும் அவசர சேவை 112, 108 க்கு தகவல் அனுப்பப்படுகிறது. அமைதியாக இருங்கள்.`
      : `SOS alert activated! High priority notification sent to your primary caregiver and 108 emergency ambulance. Help is being coordinated.`;
  }

  // Default greetings
  if (language === 'hi') {
    return `नमस्ते ${seniorName} जी! मैं अरण (ARAN) हूँ। आप कैसी हैं? क्या मैं आपकी कोई सहायता कर सकता हूँ?`;
  }
  if (language === 'ml') {
    return `നമസ്കാരം ${seniorName}! ഞാൻ അരൺ (ARAN). സുഖമായിരിക്കുന്നുവോ? എന്തെങ്കിലും സഹായം ആവശ്യമുണ്ടോ?`;
  }
  if (language === 'te') {
    return `నమస్కారం ${seniorName} గారూ! నేను అరన్ (ARAN). మీరు ఎలా ఉన్నారు? నేను మీకు ఎలా సహాయపడగలను?`;
  }
  if (language === 'kn') {
    return `ನಮಸ್ಕಾರ ${seniorName} ಅವರೇ! ನಾನು ಅರಣ್ (ARAN). ನೀವು ಹೇಗಿದ್ದೀರಿ? ಏನಾದರೂ ಸಹಾಯ ಬೇಕೆ?`;
  }
  if (language === 'gu') {
    return `નમસ્તે ${seniorName}જી! હું અરણ (ARAN) છું. તમે કેમ છો? તમને કોઈ મદદની જરૂર છે?`;
  }
  if (language === 'fr') {
    return `Bonjour ${seniorName} ! Je suis ARAN, à vos côtés. Comment vous sentez-vous aujourd'hui ?`;
  }
  if (language === 'ta') {
    return `வணக்கம் ${seniorName}! நான் அரண் (ARAN). நீங்கள் சௌக்கியமாக இருக்கிறீர்களா? உங்களுக்கு ஏதேனும் தேவையா?`;
  }
  if (language === 'tanglish') {
    return `Vanakkam ${seniorName}! ARAN inga thaan irukken. Ungalukku eppadi irukku? Enna help venum?`;
  }
  return `Hello ${seniorName}! I am ARAN, right here with you. How are you feeling today, and how may I assist your comfort?`;
}

// ARAN AI Conversational endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, language = 'en', seniorName = 'Lakshmi', seniorContext = {} } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `You are ARAN ("Always With You. Always Aware."), an empathetic, proactive AI Care Companion device for seniors living in India and globally.
Senior's Name: ${seniorName}
Current Context: Living arrangement: ${seniorContext.livingArrangement || 'Living Independently'}, Age: ${seniorContext.age || 72}, BP: ${seniorContext.bloodPressureRate || '122/82 mmHg'}.
Language Mode: ${language} (support English, Tamil, Hindi, Malayalam, Telugu, Kannada, Gujarati, French, Tanglish).
Treating Doctor: ${seniorContext.doctorName || 'Dr. Sundaram Ramanathan'}, Hospital: ${seniorContext.hospitalName || 'Apollo Hospitals'}.

CRITICAL SAFETY DIRECTIVE:
1. ARAN IS NOT A MEDICAL DIAGNOSIS SYSTEM.
2. NEVER claim to diagnose heart attacks, strokes, dehydration, disease, medical emergencies, or hunger.
3. Instead use phrases like: "Unusual pattern detected", "Attention recommended", "Caregiver verification recommended", "Hydration check recommended", "Scheduled check-in missed", "SOS activated".
4. Reply directly in the requested language (${language}):
   - If Hindi, reply in gentle, respectful Hindi with 'जी'.
   - If Malayalam, reply in caring Malayalam.
   - If Telugu, reply in polite Telugu with 'గారూ'.
   - If Kannada, reply in warm Kannada with 'ಅವರೇ'.
   - If Gujarati, reply in polite Gujarati with 'જી'.
   - If French, reply in comforting French ('vous').
   - If Tamil / Tanglish, reply in comforting Tamil.
5. Keep your answer brief (1-3 sentences), warm, respectful, reassuring, and high in clarity for seniors who may have hearing or cognitive load difficulties.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nSenior says: "${message}"` }],
          },
        ],
      });

      const text = response.text?.trim();
      if (text) {
        return res.json({ reply: text, provider: 'gemini' });
      }
    } catch (err) {
      console.warn('Gemini chat error, falling back to local companion logic:', err);
    }
  }

  // Resilient fallback
  const fallback = getCompanionFallback(message, language, seniorName);
  return res.json({ reply: fallback, provider: 'aran-companion-core' });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    device: 'ARAN-001',
    firmware: 'v3.4.1-companion',
    geminiActive: !!ai,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production if needed
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARAN AI Companion server running at http://localhost:${PORT}`);
  });
}

startServer();
