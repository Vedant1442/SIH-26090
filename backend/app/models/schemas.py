from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Literal

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    nameLocal: str = Field(..., min_length=2, max_length=150)
    craft: str = Field(..., min_length=2, max_length=100)
    status: Literal["draft", "pending", "verified"] = "draft"
    priceLow: float = Field(..., gt=0, description="Minimum price must be greater than 0")
    priceHigh: float = Field(..., gt=0, description="Maximum price must be greater than 0")
    confidence: Literal["High", "Medium", "Low"] = "Medium"
    capturedBy: str = Field(default="Artisan")
    image: str
    materials: str = Field(default="")
    timeHours: int = Field(default=1, ge=1)
    exceptions: List[str] = Field(default_factory=list)
    priceReasoning: Optional[str] = None
    merchantId: Optional[str] = None

    @model_validator(mode="after")
    def validate_price_range(self):
        if self.priceHigh < self.priceLow:
            raise ValueError("priceHigh must be greater than or equal to priceLow")
        return self

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    nameLocal: Optional[str] = None
    materials: Optional[str] = None
    priceLow: Optional[float] = Field(None, gt=0)
    priceHigh: Optional[float] = Field(None, gt=0)

    @model_validator(mode="after")
    def validate_price_range(self):
        if self.priceLow is not None and self.priceHigh is not None:
            if self.priceHigh < self.priceLow:
                raise ValueError("priceHigh must be greater than or equal to priceLow")
        return self

class Product(ProductBase):
    id: str

    class Config:
        from_attributes = True

class DocStepBase(BaseModel):
    title: str
    why: str
    status: str

class DocStepCreate(DocStepBase):
    id: str

class DocStep(DocStepBase):
    id: str

    class Config:
        from_attributes = True

class DocStatusUpdate(BaseModel):
    status: str
