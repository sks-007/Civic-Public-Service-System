import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Knowledge base for civic service responses
const knowledgeBase: { patterns: RegExp[]; response: string }[] = [
  {
    patterns: [/submit.*complaint|complaint.*submit|how.*report|report.*issue|file.*complaint/i],
    response:
      'To submit a complaint:\n\n1. Go to the "Submit Complaint" page from the navigation\n2. Fill in your personal details (name, email, phone)\n3. Select the service category (Waste, Transportation, etc.)\n4. Describe the issue with as much detail as possible\n5. Upload photos of the problem as evidence — our AI will verify authenticity automatically\n6. Click Submit and you\'ll receive a unique tracking ID (e.g., CMP-2026-XXXX)\n\nWould you like me to take you to the complaint form?',
  },
  {
    patterns: [/track|status|complaint.*id|id.*complaint|where.*complaint|progress/i],
    response:
      'To track your complaint:\n\n1. Go to "Track Complaints" in the navigation\n2. Enter your complaint ID (e.g., CMP-2026-0847)\n3. You\'ll see the current status, assigned officer, funds allocated, and resolution timeline\n\nStatuses you may see:\n- **Pending** — Complaint received, awaiting assignment\n- **Assigned** — An officer has been assigned\n- **In Progress** — Work is actively underway\n- **Resolved** — Issue has been fixed\n\nWould you like to track a specific complaint right now?',
  },
  {
    patterns: [/service.*center|department|office.*location|find.*office|where.*office/i],
    response:
      'Here are our main service departments:\n\n🗑️ **Waste Management** — Public Works Dept, 200 Civic Center Dr\n🚌 **Transportation** — Transit Authority, 150 Transit Blvd\n💧 **Water & Sewage** — Water Authority, 300 Reservoir Rd\n🌳 **Parks & Recreation** — Parks Dept, 75 Greenway Ave\n💡 **Street Lighting** — Electrical Services, 100 Power Lane\n🛡️ **Public Safety** — Police & Safety Dept, 50 Precinct Ave\n\nEach department has staff available Mon–Fri, 9 AM to 5 PM. Which service do you need assistance with?',
  },
  {
    patterns: [/streetlight|street light|light.*out|broken.*light|dark.*street/i],
    response:
      'To report a streetlight outage:\n\n1. Go to "Submit Complaint"\n2. Select **Street Lighting** as the category\n3. Provide the exact location or nearest landmark\n4. Upload a photo of the dark/broken streetlight if possible\n5. Our Electrical Services team typically responds within 24–48 hours\n\nContact: Electrical Services, 100 Power Lane | ⏱️ Response time: 24–48 hrs',
  },
  {
    patterns: [/pothole|road.*damage|broken.*road|road.*repair|road.*fix/i],
    response:
      'To report a road or pothole issue:\n\n1. Go to "Submit Complaint"\n2. Select **Transportation** as the category\n3. Describe the pothole/damage and provide the street address\n4. Upload a photo — this speeds up the repair prioritization\n5. The Road Maintenance team handles this with a typical response of 3–5 business days\n\nContact: Transit Authority, 150 Transit Blvd',
  },
  {
    patterns: [/garbage|waste|trash|collection|bin.*full|overflowing/i],
    response:
      'For waste management issues:\n\n1. Go to "Submit Complaint"\n2. Select **Waste Management** as the category\n3. Specify whether it\'s a missed collection, illegal dumping, or overflowing bin\n4. Provide the address\n5. The Sanitation team typically responds within 24–48 hours\n\nContact: Public Works Dept, 200 Civic Center Dr',
  },
  {
    patterns: [/water|leak|pipe|flood|sewage|drain/i],
    response:
      'For water and sewage issues:\n\n1. Go to "Submit Complaint"\n2. Select **Water & Sewage** as the category\n3. Describe the issue (leaking pipe, blocked drain, flooding, etc.)\n4. Upload photos — our team will prioritize based on severity\n5. Emergency leaks are handled within 2–4 hours; routine repairs within 2–3 business days\n\nContact: Water Authority, 300 Reservoir Rd | 🚨 Emergency: 1-800-CIVIC-H2O',
  },
  {
    patterns: [/park|playground|bench|tree|green|recreation/i],
    response:
      'For parks and recreation issues:\n\n1. Go to "Submit Complaint"\n2. Select **Parks & Recreation** as the category\n3. Describe the issue (broken equipment, damaged bench, fallen tree, etc.)\n4. Our Parks team responds within 3–5 business days for non-emergency issues\n\nContact: Parks Dept, 75 Greenway Ave',
  },
  {
    patterns: [/register|sign up|create.*account|new.*account/i],
    response:
      'To register for an account:\n\n1. Click "Register" in the top navigation\n2. Fill in your name, email, phone number, and ward/district\n3. Create a secure password\n4. Submit — you can start filing complaints immediately!\n\nAlready have an account? Click "Login" instead.',
  },
  {
    patterns: [/login|sign in|forgot.*password|password.*reset/i],
    response:
      'To log in:\n\n1. Click "Login" in the top navigation\n2. Enter your registered email and password\n3. Click Sign In\n\n**Demo credentials (for testing):**\n- Email: `user@demo.com`\n- Password: `demo123`\n\nForgot your password? Please contact support at support@cpss.gov',
  },
  {
    patterns: [/admin|dashboard|manage|officer/i],
    response:
      'The Admin Dashboard is available to authorized personnel only:\n\n1. Go to "Admin Login" (link at the bottom of the page)\n2. Enter admin credentials\n3. Access complaint management, officer assignment, and fund allocation\n\n**Demo admin credentials:**\n- Email: `admin@cpss.gov`\n- Password: `admin123`\n\nUnauthorized access attempts are logged.',
  },
  {
    patterns: [/ai|artificial intelligence|deepfake|image.*verify|verify.*image|fake.*image/i],
    response:
      'Our AI Image Verification system automatically checks every photo you upload:\n\n🔍 **What it checks:**\n- Digital manipulation and editing artifacts\n- GAN-generated (AI-made) image patterns\n- EXIF metadata consistency\n- Pixel-level noise analysis\n- Lighting and shadow consistency\n\n✅ **Genuine images** are flagged as verified and fast-tracked for processing.\n⚠️ **Suspicious images** are flagged for manual review by an officer.\n\nThis helps ensure accountability and prevents false complaints.',
  },
  {
    patterns: [/hello|hi|hey|good morning|good evening|good afternoon/i],
    response:
      'Hello! Welcome to the CPSS AI Assistant. 👋\n\nI can help you with:\n- Submitting civic complaints\n- Tracking complaint status\n- Finding service departments\n- Navigating the platform\n- Answering questions about civic services\n\nHow can I assist you today?',
  },
  {
    patterns: [/thank|thanks|thank you/i],
    response:
      "You're welcome! If you have any more questions or need help with anything else, feel free to ask. I'm here 24/7 to assist you with civic services. Have a great day! 😊",
  },
  {
    patterns: [/contact|reach|phone|email.*support|support.*email/i],
    response:
      'You can reach us through:\n\n📧 **Email:** support@cpss.gov\n📞 **Phone:** 1-800-CIVIC-HELP\n💬 **This chatbot:** Available 24/7\n🏢 **In person:** 200 Civic Center Dr, Mon–Fri 9 AM–5 PM\n\nFor emergencies (water main breaks, road hazards), call our emergency line: 1-800-CIVIC-911',
  },
];

const defaultResponse =
  "Thank you for your message. I can help you with:\n\n- 📝 Submitting civic complaints\n- 🔍 Tracking complaint status\n- 🏢 Finding service centers and departments\n- ❓ Answering questions about our services\n- 🤖 Understanding AI image verification\n\nPlease ask me something specific about these topics, and I'll be happy to help!";

function generateResponse(userMessage: string): string {
  for (const entry of knowledgeBase) {
    if (entry.patterns.some((pattern) => pattern.test(userMessage))) {
      return entry.response;
    }
  }
  return defaultResponse;
}

// POST /api/chatbot - Process a chat message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body as { message: string; history?: ChatMessage[] };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    const response = generateResponse(trimmedMessage);

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
