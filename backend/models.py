from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# User Models
class Credits(BaseModel):
    searchesRemaining: int = 5
    aiGenerationsRemaining: int = 3
    exportsRemaining: int = 3
    searchesUsedToday: int = 0
    aiGenerationsUsedToday: int = 0
    exportsUsedThisMonth: int = 0
    lastResetDate: datetime = Field(default_factory=datetime.utcnow)

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"
    plan: str = "Free"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    credits: Credits = Field(default_factory=Credits)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class UserInDB(User):
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    plan: str
    credits: Credits

# Pricing Plan Models
class PricingPlanBase(BaseModel):
    name: str
    description: str
    price: float
    billing: str
    trialInfo: Optional[str] = None
    features: List[str]
    searchesPerDay: int
    aiGenerations: int
    exportsPerMonth: int
    resultsPerCategory: int
    isPopular: bool = False
    isActive: bool = True

class PricingPlanCreate(PricingPlanBase):
    pass

class PricingPlan(PricingPlanBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Search Models
class InsightItem(BaseModel):
    id: str
    platform: str
    content: str
    engagement: Optional[int] = None
    trendScore: Optional[int] = None
    source: str

class ContentIdea(BaseModel):
    id: str
    title: str
    description: str
    platforms: List[str]

class SearchResult(BaseModel):
    painPoints: List[InsightItem]
    trendingIdeas: List[InsightItem]
    contentIdeas: List[ContentIdea]

class SearchRequest(BaseModel):
    query: str

class SearchHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    query: str
    results: SearchResult
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Export Models
class ExportRequest(BaseModel):
    searchId: str
    format: str  # CSV or PDF

class ExportResponse(BaseModel):
    downloadUrl: str
    success: bool

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str
    role: str = "admin"
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Payment Settings Models
class PaymentCredentials(BaseModel):
    keyId: Optional[str] = None
    keySecret: Optional[str] = None
    clientId: Optional[str] = None
    clientSecret: Optional[str] = None

class PaymentSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    gateway: str  # razorpay or paypal
    enabled: bool = False
    credentials: PaymentCredentials = Field(default_factory=PaymentCredentials)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class PaymentSettingsUpdate(BaseModel):
    gateway: str
    enabled: bool
    credentials: PaymentCredentials

# SEO Settings Models
class SEOSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page: str
    title: str
    description: str
    keywords: List[str] = []
    canonical: str
    ogImage: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class SEOSettingsUpdate(BaseModel):
    title: str
    description: str
    keywords: List[str]
    canonical: str
    ogImage: Optional[str] = None

# Auth Response Models
class AuthResponse(BaseModel):
    token: str
    user: UserResponse

class AdminAuthResponse(BaseModel):
    token: str
    admin: Dict[str, Any]

# Credit Update Model
class CreditUpdate(BaseModel):
    searchesRemaining: Optional[int] = None
    aiGenerationsRemaining: Optional[int] = None
    exportsRemaining: Optional[int] = None