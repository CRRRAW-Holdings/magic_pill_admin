from sqlalchemy import Column, Integer, String, Boolean, Numeric, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class InsuranceCompany(Base):
    __tablename__ = 'insurance_companies'

    companyId = Column(Integer, primary_key=True)
    name = Column(String)
    phoneNumber = Column(String)

    def serialize(self):
        return {
            'companyId': self.companyId,
            'name': self.name,
            'phoneNumber': self.phoneNumber,
        }

class User(Base):
    __tablename__ = 'users'

    documentId = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String, unique=True)
    firstName = Column(String)
    lastName = Column(String)
    phone = Column(String)
    address = Column(Text)
    dob = Column(String)
    age = Column(Integer)
    company = Column(String)
    companyId = Column(Integer, ForeignKey('insurance_companies.companyId'))
    planId = Column(Integer, ForeignKey('magic_pill_plans.planId'))
    isActive = Column(Boolean)
    isDependant = Column(Boolean)

    insurance_company = relationship("InsuranceCompany", backref="users")
    magic_pill_plan = relationship("MagicPillPlan", backref="users")

    def serialize(self):
        return {
            'documentId': self.documentId,
            'username': self.username,
            'email': self.email,
            'address': self.address,
            'dob': self.dob,
            'age': self.age,
            'company': self.company,
            'companyId': self.companyId,
            'planId': self.planId,
            'isActive': self.isActive,
            'phone': self.phone,
            'firstName': self.firstName,
            'lastName': self.lastName,
	    'isDependant': self.isDependant,
        }

    def serialize_full(self):
        return {
            'documentId': self.documentId,
            'username': self.username,
            'email': self.email,
            'address': self.address,
            'dob': self.dob,
            'age': self.age,
            'company': self.company,
            'companyId': self.companyId,
            'planId': self.planId,
            'isActive': self.isActive,
            'phone': self.phone,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'insurance_company': self.insurance_company.serialize(),
            'magic_pill_plan': self.magic_pill_plan.serialize(),
	    'isDependant': self.isDependant,
        }

class MagicPillPlan(Base):
    __tablename__ = 'magic_pill_plans'

    planId = Column(Integer, primary_key=True)
    planName = Column(String)
    plan_details = Column(Text)

    def serialize(self):
        return {
            'planId': self.planId,
            'planName': self.planName,
            'plan_details': self.plan_details,
        }

class Admin(Base):
    __tablename__ = 'admins'

    admin_id = Column(Integer, primary_key=True)
    admin_username = Column(String)
    admin_email = Column(String, unique=True)
    companyId = Column(Integer, ForeignKey('insurance_companies.companyId'))

    def serialize(self):
        return {
            'admin_id': self.admin_id,
            'admin_username': self.admin_username,
            'admin_email': self.admin_email,
            'companyId': self.companyId,
        }

class Drug(Base):
    __tablename__ = 'drugs'

    drug_id = Column(Integer, primary_key=True)
    drug_name = Column(String)
    manufacturer_name = Column(String)
    brand_name = Column(Text)
    cost = Column(Numeric)
    is_urgent = Column(Boolean)
    is_high_cost = Column(Boolean)
    is_free = Column(Boolean)
    plan_type = Column(String)
    drug_form = Column(Text)
    dosage = Column(Text)
    max_supply_30 = Column(Integer)
    max_supply_90 = Column(Integer)

    def serialize(self):
        return {
            'drug_id': self.drug_id,
            'drug_name': self.drug_name,
            'manufacturer_name': self.manufacturer_name,
            'brand_name': self.brand_name,
            'cost': float(self.cost),
            'is_urgent': self.is_urgent,
            'is_high_cost': self.is_high_cost,
            'is_free': self.is_free,
            'plan_type': self.plan_type,
            'drug_form': self.drug_form,
            'dosage': self.dosage,
            'max_supply_30': self.max_supply_30,
            'max_supply_90': self.max_supply_90,
        }