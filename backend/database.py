from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'insightssnap')]

# Collections
users_collection = db.users
pricing_plans_collection = db.pricing_plans
search_history_collection = db.search_history
payment_settings_collection = db.payment_settings
seo_settings_collection = db.seo_settings
admins_collection = db.admins

async def init_database():
    """Initialize database with default data"""
    
    # Create default admin if not exists
    admin_exists = await admins_collection.find_one({"username": "admin"})
    if not admin_exists:
        from auth import hash_password
        admin = {
            "username": "admin",
            "password": hash_password("admin123"),
            "role": "admin",
            "createdAt": datetime.utcnow()
        }
        await admins_collection.insert_one(admin)
        print("✓ Default admin created (username: admin, password: admin123)")
    
    # Create default pricing plans if not exists
    plans_count = await pricing_plans_collection.count_documents({})
    if plans_count == 0:
        default_plans = [
            {
                "name": "Free",
                "description": "Perfect for getting started",
                "price": 0,
                "billing": "forever",
                "features": [
                    "5 searches per day",
                    "3 AI script generations (lifetime)",
                    "Real-time insights",
                    "3 exports to CSV/PDF per month",
                    "3 results per category (combined)",
                    "Community support"
                ],
                "searchesPerDay": 5,
                "aiGenerations": 3,
                "exportsPerMonth": 3,
                "resultsPerCategory": 3,
                "isPopular": False,
                "isActive": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "name": "Standard",
                "description": "For growing creators",
                "price": 6.99,
                "billing": "month",
                "trialInfo": "7 days free trial for first-time users",
                "features": [
                    "50 searches per day",
                    "25 AI script generations per day",
                    "Time period filtering",
                    "9 results per category (3 per platform)",
                    "30 exports to CSV/PDF per month",
                    "Email support"
                ],
                "searchesPerDay": 50,
                "aiGenerations": 25,
                "exportsPerMonth": 30,
                "resultsPerCategory": 9,
                "isPopular": False,
                "isActive": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "name": "Pro",
                "description": "For serious content creators",
                "price": 14.99,
                "billing": "month",
                "trialInfo": "7 days free trial for first-time Standard users",
                "features": [
                    "Unlimited searches",
                    "Unlimited AI script generations",
                    "Advanced time filtering",
                    "15 results per category (5 per platform)",
                    "Auto-translation",
                    "Priority support",
                    "Trend alerts"
                ],
                "searchesPerDay": -1,
                "aiGenerations": -1,
                "exportsPerMonth": -1,
                "resultsPerCategory": 15,
                "isPopular": True,
                "isActive": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        ]
        await pricing_plans_collection.insert_many(default_plans)
        print("✓ Default pricing plans created")
    
    # Create default SEO settings if not exists
    seo_count = await seo_settings_collection.count_documents({})
    if seo_count == 0:
        default_seo = [
            {
                "page": "home",
                "title": "InsightsSnap - Discover What Your Audience Really Wants",
                "description": "Uncover pain points, trending ideas, and content opportunities from millions of conversations across Reddit, X, and YouTube in real-time.",
                "keywords": ["audience insights", "content research", "social listening", "AI analysis"],
                "canonical": "https://insightssnap.co",
                "ogImage": "https://insightssnap.co/og-image.jpg",
                "updatedAt": datetime.utcnow()
            },
            {
                "page": "pricing",
                "title": "Pricing - InsightsSnap",
                "description": "Choose the perfect plan for your content creation needs. Start free and upgrade as you grow.",
                "keywords": ["pricing", "plans", "subscription"],
                "canonical": "https://insightssnap.co/pricing",
                "updatedAt": datetime.utcnow()
            },
            {
                "page": "dashboard",
                "title": "Dashboard - InsightsSnap",
                "description": "Search for audience insights and discover what content resonates.",
                "keywords": ["dashboard", "insights", "analytics"],
                "canonical": "https://insightssnap.co/dashboard",
                "updatedAt": datetime.utcnow()
            }
        ]
        await seo_settings_collection.insert_many(default_seo)
        print("✓ Default SEO settings created")

async def close_database():
    client.close()