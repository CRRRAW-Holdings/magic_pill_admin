import { firestore } from './authfirebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import axios from 'axios';

export const fetchAdminByEmail = async (email) => {
  try {
    const adminsRef = collection(firestore, 'admins');
    const q = query(adminsRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0].data();

      // Fetch company details for each companyId
      const companiesRef = collection(firestore, 'companies');
      const companyPromises = adminDoc.insuranceCompanyIds.map(async (companyId) => {
        const companyQuery = query(companiesRef, where('companyId', '==', companyId));
        const companyQuerySnapshot = await getDocs(companyQuery);
        if (!companyQuerySnapshot.empty) {
          return companyQuerySnapshot.docs[0].data();
        }
        return null;
      });
      const companies = await Promise.all(companyPromises);

      // Filter out any null values in case some companies weren't found
      adminDoc.companies = companies.filter(company => company !== null);

      return adminDoc;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching admin by email:', error);
    throw error;
  }
};

export const fetchEmployeesFromCompany = async (companyId) => {
  try {
    const employeesRef = collection(firestore, 'employees');
    const employeesQuery = query(employeesRef, where('companyId', '==', parseInt(companyId)));
    const employeeQuerySnapshot = await getDocs(employeesQuery);

    const companiesRef = collection(firestore, 'companies');
    const companyQuery = query(companiesRef, where('companyId', '==', parseInt(companyId)));
    const companyQuerySnapshot = await getDocs(companyQuery);

    const plansRef = collection(firestore, 'plans');

    let companyName = '';
    if (!companyQuerySnapshot.empty) {
      companyName = companyQuerySnapshot.docs[0].data().name;
    }

    const employees = await Promise.all(employeeQuerySnapshot.docs.map(async (doc) => {
      const employeeData = doc.data();
      const documentId = doc.id; // Get the document ID

      // Fetch plan name based on planId
      let planName = '';
      if (employeeData.planId) {
        const planQuery = query(plansRef, where('planId', '==', employeeData.planId));
        const planQuerySnapshot = await getDocs(planQuery);
        if (!planQuerySnapshot.empty) {
          planName = planQuerySnapshot.docs[0].data().name;
        }
      }

      return { ...employeeData, documentId, companyName, planName }; // Include documentId in the return
    }));

    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return null;
  }
};



export const addEmployeeToCompany = async (employeeData) => {
  try {
    if(employeeData.email) {
      employeeData.email = employeeData.email.toLowerCase();
    }
    const docRef = await addDoc(collection(firestore, 'employees'), { ...employeeData });
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const employee = docSnap.data();
      let planName = '';

      if (employee.planId) {
        const plansRef = collection(firestore, 'plans');
        const planQuery = query(plansRef, where('planId', '==', employee.planId));
        const planQuerySnapshot = await getDocs(planQuery);
        if (!planQuerySnapshot.empty) {
          planName = planQuerySnapshot.docs[0].data().name;
        }
      }

      return { documentId: docRef.id, ...employee, planName };
    } else {
      throw new Error('Failed to fetch newly added employee.');
    }
  } catch (error) {
    console.error('Error adding employee to company:', error);
    throw error;
  }
};

export const updateEmployeeDetails = async (documentId, employeeData) => {
  try {
    if(employeeData.email) {
      employeeData.email = employeeData.email.toLowerCase();
    }

    if (!documentId) {
      throw new Error('documentId is undefined or invalid');
    }

    const employeeRef = doc(firestore, 'employees', documentId);
    await updateDoc(employeeRef, employeeData);

    const updatedDocSnap = await getDoc(employeeRef);
    if (updatedDocSnap.exists()) {
      const updatedEmployee = updatedDocSnap.data();
      let planName = '';

      if (updatedEmployee.planId) {
        const plansRef = collection(firestore, 'plans');
        const planQuery = query(plansRef, where('planId', '==', updatedEmployee.planId));
        const planQuerySnapshot = await getDocs(planQuery);
        if (!planQuerySnapshot.empty) {
          planName = planQuerySnapshot.docs[0].data().name;
        }
      }

      return { documentId, ...updatedEmployee, planName };
    } else {
      throw new Error('Failed to fetch updated employee.');
    }
  } catch (error) {
    console.error('Error updating employee details:', error);
    throw error;
  }
};

export const toggleEmployeeStatus = async (employeeId) => {
  try {
    const employeeRef = doc(firestore, 'employees', employeeId);
    const docSnap = await getDoc(employeeRef);

    if (docSnap.exists()) {
      const newStatus = !docSnap.data().isActive;
      await updateDoc(employeeRef, { isActive: newStatus });

      const updatedDocSnap = await getDoc(employeeRef);
      if (updatedDocSnap.exists()) {
        const updatedEmployee = updatedDocSnap.data();
        let planName = '';

        if (updatedEmployee.planId) {
          const plansRef = collection(firestore, 'plans');
          const planQuery = query(plansRef, where('planId', '==', updatedEmployee.planId));
          const planQuerySnapshot = await getDocs(planQuery);
          if (!planQuerySnapshot.empty) {
            planName = planQuerySnapshot.docs[0].data().name;
          }
        }

        return { documentId: updatedDocSnap.id, ...updatedEmployee, planName };
      } else {
        throw new Error('Failed to fetch updated document.');
      }
    } else {
      throw new Error('Document does not exist');
    }
  } catch (error) {
    console.error('Error in toggleEmployeeStatus:', error);
    throw error;
  }
};

// Company
export const fetchCompaniesFromApi = async () => {
  const companiesRef = collection(firestore, 'companies');
  const querySnapshot = await getDocs(companiesRef);
  return querySnapshot.docs.map(doc => doc.data());
};

export const fetchPlans = async () => {
  const plansRef = collection(firestore, 'plans');
  const querySnapshot = await getDocs(plansRef);
  return querySnapshot.docs.map(doc => doc.data());
};

export const uploadCSVData = async (companyId, csvData, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    const url = `${process.env.REACT_APP_API_URL}/bulk-upload/${companyId}`;
    const response = await axios.post(url, csvData, { headers });
    return {
      status: 'success',
      data: response.data,
    };
  } catch (error) {
    throw new Error(error.response?.data || 'An error occurred while uploading CSV data.');
  }
};

export const approveEmployeeChanges = async (approvedData, companyId, token) => {
  try {
    const url = `${process.env.REACT_APP_API_URL}/approve-employee-changes/${companyId}`;
    const response = await axios.post(url, approvedData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return {
        status: 'success',
        data: response.data
      };
    } else {
      throw new Error('Failed to process the approved changes');
    }
  } catch (error) {
    console.error('Error in approveEmployeeChanges:', error);
    throw error;
  }
};
