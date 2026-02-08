import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c39e4079/health", (c) => {
  const hasApiKey = !!Deno.env.get("GEMINI_API_KEY");
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  return c.json({ 
    status: "ok",
    gemini_configured: hasApiKey,
    api_key_length: apiKey ? apiKey.length : 0,
    api_key_preview: apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : null,
    timestamp: new Date().toISOString()
  });
});

// Test Gemini API endpoint
app.get("/make-server-c39e4079/test-gemini", async (c) => {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  
  if (!apiKey) {
    return c.json({ 
      success: false, 
      error: "No API key configured" 
    });
  }

  try {
    console.log("Testing Gemini API with key:", `${apiKey.substring(0, 10)}...`);
    
    // Try to list available models
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error("List models error:", errorText);
      return c.json({
        success: false,
        error: "Failed to list models",
        status: listResponse.status,
        details: errorText
      });
    }
    
    const models = await listResponse.json();
    console.log("Available models:", JSON.stringify(models, null, 2));
    
    // Extract model names that support generateContent
    const availableModels = models.models
      ?.filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      ?.map((m: any) => m.name) || [];
    
    return c.json({
      success: true,
      available_models: availableModels,
      full_response: models
    });
  } catch (error) {
    console.error("Test error:", error);
    return c.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Helper function to detect if query is for electronics
function isElectronicsQuery(query: string): boolean {
  const electronicsKeywords = [
    'phone', 'mobile', 'smartphone', 'iphone', 'samsung', 'oneplus', 'realme', 'oppo', 'vivo', 'xiaomi', 'redmi',
    'laptop', 'computer', 'pc', 'macbook', 'dell', 'hp', 'lenovo', 'asus',
    'tablet', 'ipad',
    'headphone', 'earphone', 'earbuds', 'airpods', 'speaker', 'audio',
    'camera', 'dslr', 'gopro',
    'tv', 'television', 'monitor', 'display',
    'smartwatch', 'watch', 'fitband', 'fitness band',
    'console', 'playstation', 'xbox', 'gaming',
    'charger', 'powerbank', 'power bank',
    'router', 'modem', 'wifi',
    'keyboard', 'mouse', 'webcam',
    'ssd', 'harddisk', 'hard disk', 'pendrive', 'ram',
    'processor', 'graphic card', 'gpu',
    'alexa', 'echo', 'smart home',
    'refrigerator', 'fridge', 'washing machine', 'ac', 'air conditioner', 'microwave'
  ];
  
  const lowerQuery = query.toLowerCase();
  return electronicsKeywords.some(keyword => lowerQuery.includes(keyword));
}

// Helper function to call Gemini API
async function callGemini(query: string, isElectronics: boolean) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    console.log("ℹ️ No Gemini API key configured - will use demo data");
    throw new Error("API_KEY_NOT_CONFIGURED");
  }

  console.log(`🔑 Using API key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`📱 Product category: ${isElectronics ? "Electronics" : "General"}`);
  
  // First, discover which models are available
  let modelName = "gemini-pro"; // fallback
  try {
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    if (listResponse.ok) {
      const modelsData = await listResponse.json();
      console.log("📋 Available models:", JSON.stringify(modelsData, null, 2));
      
      // Find first model that supports generateContent
      const availableModel = modelsData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes("generateContent")
      );
      
      if (availableModel) {
        // Extract just the model name (remove "models/" prefix)
        modelName = availableModel.name.replace("models/", "");
        console.log(`✅ Using discovered model: ${modelName}`);
      }
    }
  } catch (error) {
    console.log("⚠️ Could not list models, using fallback:", error.message);
  }
  
  // Define which platforms to include based on product category
  const platformsPrompt = isElectronics ? `
IMPORTANT: This is an ELECTRONICS product. Return ONLY Amazon and Flipkart.
- Meesho and Myntra DO NOT sell electronics/smartphones/laptops
- Only include Amazon and Flipkart in your response

Return this JSON structure with ONLY 2 platforms:
{
  "product_name": "${query}",
  "platforms": [
    {
      "name": "Amazon",
      "price": "₹XX,XXX",
      "rating": "4.3/5",
      "delivery": "Free delivery by Tomorrow",
      "offer": "10% instant discount with SBI Credit Card",
      "link": "https://www.amazon.in/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}"
    },
    {
      "name": "Flipkart",
      "price": "₹XX,XXX",
      "rating": "4.5/5",
      "delivery": "Free delivery",
      "offer": "Extra ₹1000 off on HDFC Cards",
      "link": "https://www.flipkart.com/search?q=${encodeURIComponent(query).replace(/%20/g, '+')}"
    }
  ]
}` : `
Return this JSON structure with all 4 platforms:
{
  "product_name": "${query}",
  "platforms": [
    {
      "name": "Amazon",
      "price": "₹XX,XXX",
      "rating": "4.3/5",
      "delivery": "Free delivery by Tomorrow",
      "offer": "10% instant discount with SBI Credit Card",
      "link": "https://www.amazon.in/s?k=${encodeURIComponent(query).replace(/%20/g, '+')}"
    },
    {
      "name": "Flipkart",
      "price": "₹XX,XXX",
      "rating": "4.5/5",
      "delivery": "Free delivery",
      "offer": "Extra ₹1000 off on HDFC Cards",
      "link": "https://www.flipkart.com/search?q=${encodeURIComponent(query).replace(/%20/g, '+')}"
    },
    {
      "name": "Meesho",
      "price": "₹XX,XXX",
      "rating": "4.2/5",
      "delivery": "Free delivery",
      "offer": "Lowest price guarantee",
      "link": "https://www.meesho.com/search?q=${encodeURIComponent(query).replace(/%20/g, '+')}"
    },
    {
      "name": "Myntra",
      "price": "₹XX,XXX",
      "rating": "4.4/5",
      "delivery": "Free delivery on orders above ₹999",
      "offer": "Extra 10% off on prepaid orders",
      "link": "https://www.myntra.com/${encodeURIComponent(query).replace(/%20/g, '-').toLowerCase()}"
    }
  ]
}`;
  
  // Try v1 API first
  let url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
  console.log(`📡 Calling Gemini API: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
  
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a price comparison AI for Indian e-commerce platforms. Provide realistic market prices for the requested product.

Product: ${query}

CRITICAL PRICE FORMAT RULES:
- Prices MUST be in format: ₹XX,XXX (with rupee symbol and comma separators)
- Examples: ₹45,999 or ₹1,25,000 or ₹12,499
- NEVER use decimal points, NEVER use words like "around" or "approximately"
- Use realistic 2024-2025 Indian market prices

${platformsPrompt}

Replace XX,XXX with realistic numeric prices. Vary prices slightly across platforms (±5-15%).

RESPOND WITH ONLY THE JSON - NO MARKDOWN, NO CODE BLOCKS, NO EXPLANATIONS.`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      }
    }),
  });
  
  // If v1 fails, try v1beta
  if (!response.ok && response.status === 404) {
    console.log("⚠️ v1 failed, trying v1beta...");
    url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a price comparison AI for Indian e-commerce platforms. Provide realistic market prices for the requested product.

Product: ${query}

CRITICAL PRICE FORMAT RULES:
- Prices MUST be in format: ₹XX,XXX (with rupee symbol and comma separators)
- Examples: ₹45,999 or ₹1,25,000 or ₹12,499
- NEVER use decimal points, NEVER use words like "around" or "approximately"
- Use realistic 2024-2025 Indian market prices

${platformsPrompt}

Replace XX,XXX with realistic numeric prices. Vary prices slightly across platforms (±5-15%).

RESPOND WITH ONLY THE JSON - NO MARKDOWN, NO CODE BLOCKS, NO EXPLANATIONS.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        }
      }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    
    // For quota errors, just log a simple message without the full error text
    if (response.status === 429) {
      console.log("⚠️ Gemini API quota exceeded (20 requests/day on free tier) - using demo data");
      throw new Error("QUOTA_EXCEEDED");
    }
    
    // For other errors, log the full details
    console.error(`Gemini API error: ${response.status} - ${errorText}`);
    
    if (response.status === 401 || response.status === 403) {
      console.log("⚠️ Invalid Gemini API key - will use demo data");
      throw new Error("INVALID_API_KEY");
    }
    
    if (response.status === 400) {
      console.log("⚠️ Bad request to Gemini API - will use demo data");
      throw new Error("BAD_REQUEST");
    }
    
    if (response.status === 404) {
      console.log("⚠️ Gemini API model not found - will use demo data");
      throw new Error("MODEL_NOT_FOUND");
    }
    
    console.error(`Gemini API error: ${response.status}`);
    throw new Error(`API_ERROR_${response.status}`);
  }

  const data = await response.json();
  
  // Check for blocked content or other safety issues
  if (data.promptFeedback && data.promptFeedback.blockReason) {
    console.error("Gemini blocked the content:", data.promptFeedback.blockReason);
    throw new Error("CONTENT_BLOCKED");
  }
  
  if (!data.candidates || data.candidates.length === 0) {
    console.error("No candidates in Gemini response:", JSON.stringify(data));
    throw new Error("NO_RESPONSE");
  }
  
  // Check if the response was blocked by safety filters
  if (data.candidates[0].finishReason === "SAFETY") {
    console.error("Response blocked by Gemini safety filters");
    throw new Error("SAFETY_BLOCK");
  }
  
  return data.candidates[0].content.parts[0].text;
}

// Parse product data from Gemini response
function parseProductData(content: string) {
  try {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```\n?/g, "");
    }
    
    // Check if JSON is incomplete (common with truncated responses)
    const openBraces = (cleaned.match(/{/g) || []).length;
    const closeBraces = (cleaned.match(/}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/\]/g) || []).length;
    
    if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
      console.error("❌ Incomplete JSON detected - braces/brackets don't match");
      console.error(`Open braces: ${openBraces}, Close braces: ${closeBraces}`);
      console.error(`Open brackets: ${openBrackets}, Close brackets: ${closeBrackets}`);
      console.error("Incomplete content:", cleaned.substring(0, 500));
      throw new Error("Incomplete JSON response from API");
    }
    
    const data = JSON.parse(cleaned);
    
    // Validate the structure
    if (!data.platforms || !Array.isArray(data.platforms) || data.platforms.length === 0) {
      console.error("❌ Invalid data structure - missing or empty platforms array");
      throw new Error("Invalid data structure");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to parse product data:", error);
    console.error("Content was:", content.substring(0, 1000));
    throw error;
  }
}

// Generate realistic mock data as fallback
function generateMockData(query: string, isElectronics?: boolean) {
  const basePrice = Math.floor(Math.random() * 50000) + 10000;
  
  // Check if electronics if not already determined
  if (isElectronics === undefined) {
    isElectronics = isElectronicsQuery(query);
  }
  
  const allPlatforms = [
    {
      name: "Amazon",
      price: `₹${(basePrice + 1000).toLocaleString('en-IN')}`,
      rating: "4.3/5",
      delivery: "Free delivery in 2 days",
      offer: "10% instant discount with SBI Credit Card",
      link: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`
    },
    {
      name: "Flipkart",
      price: `₹${basePrice.toLocaleString('en-IN')}`,
      rating: "4.5/5",
      delivery: "Free delivery by Tomorrow",
      offer: "Bank Offer: ₹1000 off on HDFC Cards",
      link: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`
    },
    {
      name: "Meesho",
      price: `₹${(basePrice + 2000).toLocaleString('en-IN')}`,
      rating: "4.2/5",
      delivery: "Free delivery in 3-5 days",
      offer: "Extra 5% off on first order",
      link: `https://www.meesho.com/search?q=${encodeURIComponent(query)}`
    },
    {
      name: "Myntra",
      price: `₹${(basePrice + 3000).toLocaleString('en-IN')}`,
      rating: "4.4/5",
      delivery: "Free delivery in 3 days",
      offer: "Additional 10% off with app",
      link: `https://www.myntra.com/search?q=${encodeURIComponent(query)}`
    }
  ];
  
  // For electronics, only include Amazon and Flipkart
  const platforms = isElectronics ? allPlatforms.slice(0, 2) : allPlatforms;
  
  return {
    product_name: query,
    platforms: platforms
  };
}

// Search and compare product prices
app.post("/make-server-c39e4079/search", async (c) => {
  try {
    const { query } = await c.req.json();
    
    if (!query) {
      console.error("Search endpoint: query parameter is missing");
      return c.json({ error: "Product query is required" }, 400);
    }

    console.log(`Searching for product: ${query}`);

    // Determine if this is an electronics query
    const isElectronics = isElectronicsQuery(query);
    console.log(`Product category: ${isElectronics ? "Electronics (Amazon + Flipkart only)" : "General (All platforms)"}`);

    let productData;
    let usedMockData = false;

    // Try to call Gemini API
    try {
      const geminiResponse = await callGemini(query, isElectronics);
      console.log("✅ Successfully fetched live data from Gemini");
      console.log("Response length:", geminiResponse.length);
      console.log("Response preview:", geminiResponse.substring(0, 500));
      console.log("Full response:", geminiResponse);
      
      // Try to parse the response
      try {
        productData = parseProductData(geminiResponse);
        console.log("✅ Successfully parsed live price data");
        console.log("Parsed platforms:", JSON.stringify(productData.platforms, null, 2));
      } catch (parseError) {
        console.log("⚠️ Parse error - falling back to demo data:", parseError.message);
        productData = generateMockData(query, isElectronics);
        usedMockData = true;
      }
    } catch (apiError) {
      // Log the specific error type for debugging
      const errorType = apiError.message;
      if (errorType.includes("API_KEY")) {
        console.log("📊 No API key configured - using demo data");
      } else if (errorType.includes("INVALID")) {
        console.log("⚠️ Invalid API key - using demo data");
      } else if (errorType.includes("MODEL_NOT_FOUND")) {
        console.log("⚠ Model not found - check API endpoint - using demo data");
      } else if (errorType.includes("CONTENT_BLOCKED") || errorType.includes("SAFETY")) {
        console.log("⚠️ Content blocked by safety filters - using demo data");
      } else if (errorType.includes("NO_RESPONSE")) {
        console.log("⚠️ No response from API - using demo data");
      } else if (errorType.includes("QUOTA_EXCEEDED")) {
        console.log("⚠️ API quota exceeded - using demo data");
      } else {
        console.error("❌ Unexpected API error:", apiError.message);
      }
      productData = generateMockData(query, isElectronics);
      usedMockData = true;
    }

    // Validate parsed data
    if (!productData.platforms || !Array.isArray(productData.platforms) || productData.platforms.length === 0) {
      console.error("Invalid platform data, regenerating mock data");
      productData = generateMockData(query, isElectronics);
      usedMockData = true;
    }

    // Find best deal
    const platforms = productData.platforms;
    let bestDeal = null;
    let lowestPrice = Infinity;

    platforms.forEach((platform: { name: string; price: string }) => {
      try {
        const priceStr = platform.price.replace(/[₹,]/g, "");
        const price = parseFloat(priceStr);
        if (!isNaN(price) && price > 0 && price < lowestPrice) {
          lowestPrice = price;
          bestDeal = platform;
        }
      } catch (error) {
        console.error(`Failed to parse price for platform ${platform.name}:`, error);
      }
    });

    // Add best_deal flag
    if (bestDeal) {
      platforms.forEach((platform: { name: string; is_best_deal?: boolean }) => {
        platform.is_best_deal = platform.name === bestDeal.name;
      });
    }

    const result = {
      success: true,
      product_name: productData.product_name || query,
      platforms: platforms,
      best_deal: bestDeal,
      searched_at: new Date().toISOString(),
      data_source: usedMockData ? "demo" : "live",
    };

    console.log("Returning search result with data source:", result.data_source);
    return c.json(result);

  } catch (error) {
    console.error("Unexpected error in search endpoint:", error);
    console.error("Error stack:", error.stack);
    
    // Last resort fallback
    try {
      const body = await c.req.json();
      const query = body.query || "Product";
      const mockData = generateMockData(query);
      const platforms = mockData.platforms;
      
      // Find best deal
      let bestDeal = platforms[1]; // Flipkart is usually cheapest in mock
      platforms.forEach((p: { name: string; is_best_deal?: boolean }) => {
        if (p.name === "Flipkart") p.is_best_deal = true;
      });
      
      return c.json({
        success: true,
        product_name: mockData.product_name,
        platforms: platforms,
        best_deal: bestDeal,
        searched_at: new Date().toISOString(),
        data_source: "demo",
      });
    } catch {
      return c.json({ 
        error: "Internal server error during search", 
        details: error.message,
        type: error.constructor.name
      }, 500);
    }
  }
});

// Chat endpoint for conversational queries
app.post("/make-server-c39e4079/chat", async (c) => {
  try {
    const { message } = await c.req.json();
    
    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    console.log(`Chat message: ${message}`);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return c.json({ 
        error: "API key not configured",
        details: "Gemini API key is not set. Please configure it in your environment."
      }, 500);
    }

    console.log(`🔑 Using API key for chat: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}`);
    
    // Discover which models are available
    let modelName = "gemini-pro"; // fallback
    try {
      const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
      if (listResponse.ok) {
        const modelsData = await listResponse.json();
        
        // Find first model that supports generateContent
        const availableModel = modelsData.models?.find((m: any) => 
          m.supportedGenerationMethods?.includes("generateContent")
        );
        
        if (availableModel) {
          modelName = availableModel.name.replace("models/", "");
          console.log(`✅ Using discovered model for chat: ${modelName}`);
        }
      }
    } catch (error) {
      console.log("⚠️ Could not list models for chat, using fallback:", error.message);
    }
    
    // Try v1 API first
    let url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
    console.log(`📡 Calling Gemini API for chat: ${url.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are SmartShop AI, a helpful shopping assistant that helps users find the best deals on products in India. When users ask about products, provide information about prices on Amazon, Flipkart, Meesho, and Myntra. Be concise, helpful, and focus on saving users money. Format your responses clearly with prices, platforms, and recommendations.

User message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      }),
    });
    
    // If v1 fails, try v1beta
    if (!response.ok && response.status === 404) {
      console.log("⚠️ v1 failed for chat, trying v1beta...");
      url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are SmartShop AI, a helpful shopping assistant that helps users find the best deals on products in India. When users ask about products, provide information about prices on Amazon, Flipkart, Meesho, and Myntra. Be concise, helpful, and focus on saving users money. Format your responses clearly with prices, platforms, and recommendations.

User message: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          }
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return c.json({ 
        error: "Failed to get response from Gemini API", 
        details: `HTTP ${response.status}: ${errorText}` 
      }, response.status);
    }

    const data = await response.json();
    
    // Check for blocked content
    if (data.promptFeedback && data.promptFeedback.blockReason) {
      console.error("Gemini blocked the content:", data.promptFeedback.blockReason);
      return c.json({ 
        error: "Content was blocked by Gemini",
        details: data.promptFeedback.blockReason 
      }, 400);
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates in Gemini chat response:", JSON.stringify(data));
      return c.json({ error: "No response from Gemini API" }, 500);
    }
    
    // Check for safety blocks
    if (data.candidates[0].finishReason === "SAFETY") {
      console.error("Response blocked by Gemini safety filters");
      return c.json({ 
        error: "Response blocked by safety filters",
        details: "The response was filtered for safety reasons. Please rephrase your question."
      }, 400);
    }
    
    const assistantMessage = data.candidates[0].content.parts[0].text;

    return c.json({
      response: assistantMessage,
      success: true,
    });

  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return c.json({ 
      error: "Internal server error", 
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);