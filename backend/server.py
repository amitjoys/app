from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from contextlib import asynccontextmanager

from models import (
    UserCreate, UserLogin, UserResponse, AuthResponse,
    PricingPlan, PricingPlanCreate,
    SearchRequest, SearchResult, ExportRequest, ExportResponse,
    AdminLogin, AdminAuthResponse,
    PaymentSettings, PaymentSettingsUpdate,
    SEOSettings, SEOSettingsUpdate,
    CreditUpdate, InsightItem, ContentIdea
)
from auth import hash_password, verify_password, create_access_token, get_current_user, get_current_admin
from database import (
    users_collection, pricing_plans_collection, search_history_collection,
    payment_settings_collection, seo_settings_collection, admins_collection,
    init_database, close_database
)
from datetime import datetime
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_database()
    logger.info("Database initialized")
    yield
    # Shutdown
    await close_database()
    logger.info("Database connection closed")

# Create the main app
app = FastAPI(lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== Authentication Routes ====================

@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["id"] = str(uuid.uuid4())
    user_dict["role"] = "user"
    user_dict["plan"] = "Free"
    user_dict["credits"] = {
        "searchesRemaining": 5,
        "aiGenerationsRemaining": 3,
        "exportsRemaining": 3,
        "searchesUsedToday": 0,
        "aiGenerationsUsedToday": 0,
        "exportsUsedThisMonth": 0,
        "lastResetDate": datetime.utcnow()
    }
    user_dict["createdAt"] = datetime.utcnow()
    user_dict["updatedAt"] = datetime.utcnow()
    
    await users_collection.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"sub": user_dict["id"], "role": user_dict["role"]})
    
    # Return response
    user_response = UserResponse(
        id=user_dict["id"],
        name=user_dict["name"],
        email=user_dict["email"],
        role=user_dict["role"],
        plan=user_dict["plan"],
        credits=user_dict["credits"]
    )
    
    return AuthResponse(token=token, user=user_response)

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create token
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    
    # Return response
    user_response = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        plan=user["plan"],
        credits=user["credits"]
    )
    
    return AuthResponse(token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await users_collection.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        plan=user["plan"],
        credits=user["credits"]
    )

# ==================== User Routes ====================

@api_router.get("/users/credits")
async def get_credits(current_user: dict = Depends(get_current_user)):
    user = await users_collection.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user["credits"]

@api_router.post("/users/upgrade")
async def upgrade_plan(plan_data: dict, current_user: dict = Depends(get_current_user)):
    plan_id = plan_data.get("planId")
    
    # Get the plan
    plan = await pricing_plans_collection.find_one({"id": plan_id})
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Update user plan and credits
    new_credits = {
        "searchesRemaining": plan["searchesPerDay"],
        "aiGenerationsRemaining": plan["aiGenerations"],
        "exportsRemaining": plan["exportsPerMonth"],
        "searchesUsedToday": 0,
        "aiGenerationsUsedToday": 0,
        "exportsUsedThisMonth": 0,
        "lastResetDate": datetime.utcnow()
    }
    
    await users_collection.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "plan": plan["name"],
                "credits": new_credits,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    return {"success": True, "plan": plan["name"]}

# ==================== Insights Routes ====================

@api_router.post("/insights/search", response_model=SearchResult)
async def search_insights(search_data: SearchRequest, current_user: dict = Depends(get_current_user)):
    # Get user
    user = await users_collection.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has credits
    if user["credits"]["searchesRemaining"] <= 0:
        raise HTTPException(status_code=403, detail="No search credits remaining")
    
    # Mock search results (replace with actual API integration)
    results = SearchResult(
        painPoints=[
            InsightItem(
                id=str(uuid.uuid4()),
                platform="Reddit",
                content=f"Finding consistent {search_data.query} content ideas is exhausting",
                engagement=342,
                source="r/ContentCreation"
            ),
            InsightItem(
                id=str(uuid.uuid4()),
                platform="X",
                content=f"Struggling to understand {search_data.query} audience preferences",
                engagement=156,
                source="@CreatorTips"
            ),
            InsightItem(
                id=str(uuid.uuid4()),
                platform="YouTube",
                content=f"Low engagement on {search_data.query} content despite regular posting",
                engagement=89,
                source="Creator Community"
            )
        ],
        trendingIdeas=[
            InsightItem(
                id=str(uuid.uuid4()),
                platform="Reddit",
                content=f"AI-powered {search_data.query} analysis tools",
                trendScore=95,
                source="r/Marketing"
            ),
            InsightItem(
                id=str(uuid.uuid4()),
                platform="X",
                content=f"Multi-platform {search_data.query} audience insights",
                trendScore=87,
                source="@TechTrends"
            ),
            InsightItem(
                id=str(uuid.uuid4()),
                platform="YouTube",
                content=f"Real-time {search_data.query} social listening",
                trendScore=82,
                source="Marketing Insights"
            )
        ],
        contentIdeas=[
            ContentIdea(
                id=str(uuid.uuid4()),
                title=f"How to validate {search_data.query} ideas before creating",
                description="A step-by-step guide based on audience discussions",
                platforms=["Reddit", "X", "YouTube"]
            ),
            ContentIdea(
                id=str(uuid.uuid4()),
                title=f"Understanding your {search_data.query} audience pain points",
                description="Tools and techniques for audience research",
                platforms=["Reddit", "X"]
            ),
            ContentIdea(
                id=str(uuid.uuid4()),
                title=f"Creating {search_data.query} content that converts",
                description="Data-driven content strategy",
                platforms=["YouTube", "X"]
            )
        ]
    )
    
    # Save search history
    search_history = {
        "id": str(uuid.uuid4()),
        "userId": current_user["id"],
        "query": search_data.query,
        "results": results.dict(),
        "timestamp": datetime.utcnow()
    }
    await search_history_collection.insert_one(search_history)
    
    # Deduct credit
    await users_collection.update_one(
        {"id": current_user["id"]},
        {
            "$inc": {
                "credits.searchesRemaining": -1,
                "credits.searchesUsedToday": 1
            }
        }
    )
    
    return results

@api_router.post("/insights/export", response_model=ExportResponse)
async def export_insights(export_data: ExportRequest, current_user: dict = Depends(get_current_user)):
    # Get user
    user = await users_collection.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has credits
    if user["credits"]["exportsRemaining"] <= 0:
        raise HTTPException(status_code=403, detail="No export credits remaining")
    
    # Mock export URL
    download_url = f"/downloads/{export_data.searchId}.{export_data.format.lower()}"
    
    # Deduct credit
    await users_collection.update_one(
        {"id": current_user["id"]},
        {
            "$inc": {
                "credits.exportsRemaining": -1,
                "credits.exportsUsedThisMonth": 1
            }
        }
    )
    
    return ExportResponse(downloadUrl=download_url, success=True)

# ==================== Pricing Routes ====================

@api_router.get("/pricing/plans")
async def get_pricing_plans():
    plans = await pricing_plans_collection.find({"isActive": True}).to_list(100)
    return [
        {
            "id": plan.get("id", str(plan["_id"])),
            "name": plan["name"],
            "description": plan["description"],
            "price": plan["price"],
            "billing": plan["billing"],
            "trialInfo": plan.get("trialInfo"),
            "features": plan["features"],
            "searchesPerDay": plan["searchesPerDay"],
            "aiGenerations": plan["aiGenerations"],
            "exportsPerMonth": plan["exportsPerMonth"],
            "resultsPerCategory": plan["resultsPerCategory"],
            "isPopular": plan["isPopular"]
        }
        for plan in plans
    ]

# ==================== Admin Authentication ====================

@api_router.post("/admin/auth/login", response_model=AdminAuthResponse)
async def admin_login(credentials: AdminLogin):
    admin = await admins_collection.find_one({"username": credentials.username})
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_access_token({"sub": str(admin["_id"]), "role": "admin"})
    
    return AdminAuthResponse(
        token=token,
        admin={"id": str(admin["_id"]), "username": admin["username"], "role": "admin"}
    )

# ==================== Admin Pricing Management ====================

@api_router.get("/admin/pricing")
async def admin_get_pricing(current_admin: dict = Depends(get_current_admin)):
    plans = await pricing_plans_collection.find({}).to_list(100)
    return [
        {
            "id": plan.get("id", str(plan["_id"])),
            "name": plan["name"],
            "description": plan["description"],
            "price": plan["price"],
            "billing": plan["billing"],
            "trialInfo": plan.get("trialInfo"),
            "features": plan["features"],
            "searchesPerDay": plan["searchesPerDay"],
            "aiGenerations": plan["aiGenerations"],
            "exportsPerMonth": plan["exportsPerMonth"],
            "resultsPerCategory": plan["resultsPerCategory"],
            "isPopular": plan["isPopular"],
            "isActive": plan["isActive"]
        }
        for plan in plans
    ]

@api_router.post("/admin/pricing")
async def admin_create_pricing(plan_data: PricingPlanCreate, current_admin: dict = Depends(get_current_admin)):
    plan_dict = plan_data.dict()
    plan_dict["id"] = str(uuid.uuid4())
    plan_dict["createdAt"] = datetime.utcnow()
    plan_dict["updatedAt"] = datetime.utcnow()
    
    await pricing_plans_collection.insert_one(plan_dict)
    
    return plan_dict

@api_router.put("/admin/pricing/{plan_id}")
async def admin_update_pricing(plan_id: str, plan_data: PricingPlanCreate, current_admin: dict = Depends(get_current_admin)):
    plan_dict = plan_data.dict()
    plan_dict["updatedAt"] = datetime.utcnow()
    
    result = await pricing_plans_collection.update_one(
        {"id": plan_id},
        {"$set": plan_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return {"success": True, "id": plan_id}

@api_router.delete("/admin/pricing/{plan_id}")
async def admin_delete_pricing(plan_id: str, current_admin: dict = Depends(get_current_admin)):
    result = await pricing_plans_collection.delete_one({"id": plan_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    return {"success": True}

# ==================== Admin Payment Settings ====================

@api_router.get("/admin/payment-settings")
async def admin_get_payment_settings(current_admin: dict = Depends(get_current_admin)):
    settings = await payment_settings_collection.find({}).to_list(10)
    
    razorpay_settings = next((s for s in settings if s["gateway"] == "razorpay"), None)
    paypal_settings = next((s for s in settings if s["gateway"] == "paypal"), None)
    
    return {
        "razorpay": {
            "enabled": razorpay_settings["enabled"] if razorpay_settings else False,
            "keyId": razorpay_settings["credentials"].get("keyId", "") if razorpay_settings else ""
        },
        "paypal": {
            "enabled": paypal_settings["enabled"] if paypal_settings else False,
            "clientId": paypal_settings["credentials"].get("clientId", "") if paypal_settings else ""
        }
    }

@api_router.put("/admin/payment-settings")
async def admin_update_payment_settings(settings_data: PaymentSettingsUpdate, current_admin: dict = Depends(get_current_admin)):
    settings_dict = settings_data.dict()
    settings_dict["updatedAt"] = datetime.utcnow()
    
    # Check if settings exist
    existing = await payment_settings_collection.find_one({"gateway": settings_data.gateway})
    
    if existing:
        await payment_settings_collection.update_one(
            {"gateway": settings_data.gateway},
            {"$set": settings_dict}
        )
    else:
        settings_dict["id"] = str(uuid.uuid4())
        await payment_settings_collection.insert_one(settings_dict)
    
    return {"success": True}

# ==================== Admin SEO Settings ====================

@api_router.get("/admin/seo-settings")
async def admin_get_seo_settings(current_admin: dict = Depends(get_current_admin)):
    settings = await seo_settings_collection.find({}).to_list(100)
    return [
        {
            "id": s.get("id", str(s["_id"])),
            "page": s["page"],
            "title": s["title"],
            "description": s["description"],
            "keywords": s.get("keywords", []),
            "canonical": s["canonical"],
            "ogImage": s.get("ogImage")
        }
        for s in settings
    ]

@api_router.get("/seo-settings/{page}")
async def get_seo_settings(page: str):
    settings = await seo_settings_collection.find_one({"page": page})
    if not settings:
        raise HTTPException(status_code=404, detail="SEO settings not found for this page")
    
    return {
        "page": settings["page"],
        "title": settings["title"],
        "description": settings["description"],
        "keywords": settings.get("keywords", []),
        "canonical": settings["canonical"],
        "ogImage": settings.get("ogImage")
    }

@api_router.put("/admin/seo-settings/{page}")
async def admin_update_seo_settings(page: str, seo_data: SEOSettingsUpdate, current_admin: dict = Depends(get_current_admin)):
    seo_dict = seo_data.dict()
    seo_dict["updatedAt"] = datetime.utcnow()
    
    # Check if settings exist
    existing = await seo_settings_collection.find_one({"page": page})
    
    if existing:
        await seo_settings_collection.update_one(
            {"page": page},
            {"$set": seo_dict}
        )
    else:
        seo_dict["id"] = str(uuid.uuid4())
        seo_dict["page"] = page
        await seo_settings_collection.insert_one(seo_dict)
    
    return {"success": True, "page": page}

# ==================== Admin User Management ====================

@api_router.get("/admin/users")
async def admin_get_users(current_admin: dict = Depends(get_current_admin)):
    users = await users_collection.find({}).to_list(1000)
    return [
        {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "plan": user["plan"],
            "credits": user["credits"],
            "createdAt": user["createdAt"]
        }
        for user in users
    ]

@api_router.put("/admin/users/{user_id}/credits")
async def admin_update_user_credits(user_id: str, credit_data: CreditUpdate, current_admin: dict = Depends(get_current_admin)):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {}
    if credit_data.searchesRemaining is not None:
        update_data["credits.searchesRemaining"] = credit_data.searchesRemaining
    if credit_data.aiGenerationsRemaining is not None:
        update_data["credits.aiGenerationsRemaining"] = credit_data.aiGenerationsRemaining
    if credit_data.exportsRemaining is not None:
        update_data["credits.exportsRemaining"] = credit_data.exportsRemaining
    
    if update_data:
        await users_collection.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
    
    return {"success": True}

# ==================== Root Route ====================

@api_router.get("/")
async def root():
    return {"message": "InsightsSnap API v1.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
