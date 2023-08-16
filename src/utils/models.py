from sqlalchemy import Column, Integer, String, Boolean, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class InsuranceCompany(Base):
    __tablename__ = "insurance_companies"

    insurance_company_id = Column(Integer, primary_key=True)
    insurance_company_name = Column(String)
    insurance_company_phone_number = Column(String)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    insurance_company_id = Column(Integer, ForeignKey("insurance_companies.insurance_company_id"))
    magic_pill_plan_id = Column(Integer, ForeignKey("magic_pill_plans.magic_pill_plan_id"))
    is_active = Column(Boolean)

    insurance_company = relationship("InsuranceCompany", backref="users")
    magic_pill_plan = relationship("MagicPillPlan", backref="users")

class MagicPillPlan(Base):
    __tablename__ = "magic_pill_plans"

    magic_pill_plan_id = Column(Integer, primary_key=True)
    plan_name = Column(String)
    plan_details = Column(Text)

class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True)
    admin_username = Column(String)
    admin_email = Column(String)
    insurance_company_id = Column(Integer, ForeignKey("insurance_companies.insurance_company_id"))

class Drug(Base):
    __tablename__ = "drugs"

    drug_id = Column(Integer, primary_key=True)
    drug_name = Column(String)
    manufacturer_name = Column(String)
    cost = Column(Numeric)
    is_urgent = Column(Boolean)
    is_high_cost = Column(Boolean)
    is_free = Column(Boolean)
    drug_form = Column(String)  # Updated column name
    dosage = Column(String)
