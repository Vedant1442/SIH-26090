from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    name: str
    nameLocal: str
    craft: str
    status: str
    priceLow: float
    priceHigh: float
    confidence: str
    capturedBy: str
    image: str
    materials: str
    timeHours: int
    exceptions: List[str]

class ProductCreate(ProductBase):
    pass

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
