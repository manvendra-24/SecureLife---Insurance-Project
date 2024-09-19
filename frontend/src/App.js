import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getProfile } from './services/AuthService';
import Login from './components/Login';
import AdminDashboard from './components/adminPages/dashboard/AdminDashboard';
import CustomerDashboard from './components/customerPages/CustomerDashboard';
import AgentDashboard from './components/agentPages/AgentDashboard';
import EmployeeDashboard from './components/employeePages/EmployeeDashboard';
import ViewCustomer from './components/adminPages/view/ViewCustomer';
import ViewAdmin from './components/adminPages/view/ViewAdmin';
import ViewAgent from './components/adminPages/view/ViewAgent';
import ViewEmployee from './components/adminPages/view/ViewEmployee';
import ViewCity from './components/adminPages/view/ViewCity';
import ViewState from './components/adminPages/view/ViewState';
import AddCity from './components/adminPages/create/AddCity';
import AddState from './components/adminPages/create/AddState';
import AddAdmin from './components/adminPages/create/AddAdmin';
import AddEmployee from './components/adminPages/create/AddEmployee';
import AddAgent from './components/adminPages/create/AddAgent';
import CustomerSignUp from './components/CustomerSignUp';
import Profile from './components/Profile';


import Loader from './sharedComponents/Loader';
import MyCommissions from './components/agentPages/MyCommissions';
import MyClients from './components/agentPages/MyClients';
import MyWithdrawals from './components/agentPages/MyWithdrawals';
import ViewWithdrawals from './components/adminPages/view/ViewWithdrawals';
import ViewClaims from './components/adminPages/view/ViewClaims';
import ViewInsuranceType from './components/adminPages/view/ViewInsurance';
import ViewScheme from './components/adminPages/view/ViewScheme';

import AddInsuranceTypeForm from './components/adminPages/create/AddType';
import AddSchemeForm from './components/adminPages/create/AddScheme';
import ForgotPassword from './components/ForgotPassword';
import AddAgentForm from './components/employeePages/AddAgent';
import ViewAgentsTable from './components/employeePages/ViewAgents';
import UpdateAgentForm from './components/employeePages/UpdateAgentForm';


import CustomerDoc from'./components/employeePages/CustomerDocuments';
import CustomerUpdateForm from './components/employeePages/CustomerUpdateForm';

import ViewCustomers from './components/employeePages/ViewCustomers';
import ViewQueries from './components/customerPages/ViewQueries';
import ViewQueriesForEmployee from './components/employeePages/ViewQueriesForEmployee';
import ViewPolicyTable from './components/customerPages/ViewPolicies';
import ViewInstallmentTable from './components/customerPages/ViewInstallments';
import ClaimDoc from'./components/adminPages/view/ClaimDocuments';
import InsurancePlanForm from './components/adminPages/view/InsurancePlanForm';

import InsuranceSchemesByType from './components/customerPages/InsuranceSchemesByType';
import InsurancePlansByScheme from './components/customerPages/InsurancePlanByScheme';
import ChangePassword from './components/ChangePassword';
import UpdateSchemeForm from './components/adminPages/update/UpdateSchemeForm';


const AuthRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await getProfile(token);
          const role = profile.role;

          switch (role) {
            case 'ROLE_ADMIN':
              navigate('/SecureLife.com/admin/dashboard');
              break;
            case 'ROLE_CUSTOMER':
              navigate('/SecureLife.com/customer/dashboard');
              break;
            case 'ROLE_EMPLOYEE':
              navigate('/SecureLife.com/employee/dashboard');
              break;
            case 'ROLE_AGENT':
              navigate('/SecureLife.com/agent/dashboard');
              break;
            default:
              navigate('/SecureLife.com/login');
              break;
          }
        } catch (error) {
          console.error('Failed to get profile:', error);
          navigate('/SecureLife.com/login');
        }
      } else {
        navigate('/SecureLife.com/login');
      }
      setLoading(false);
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return loading ? <Loader /> : <Login />;
};

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthRedirect />} />

      <Route path='/SecureLife.com/login' element={<Login />} />
      <Route path='/SecureLife.com/register' element={<CustomerSignUp />}/>     
      <Route path="/SecureLife.com/password" element={<ForgotPassword/>}/>

      <Route path='/SecureLife.com/user/profile' element={<Profile/>}/>
      <Route path="/SecureLife.com/user/password/change" element={<ChangePassword />} />
      

      <Route path="/SecureLife.com/admin/dashboard" element={<AdminDashboard />} />
      <Route path='/SecureLife.com/admin/customers' element={<ViewCustomer />} />
      <Route path='/SecureLife.com/admin/admins' element={<ViewAdmin />} />
      <Route path='/SecureLife.com/admin/agents' element={<ViewAgent />} />
      <Route path='/SecureLife.com/admin/employees' element={<ViewEmployee />} />
      <Route path='/SecureLife.com/admin/cities' element={<ViewCity />} />
      <Route path='/SecureLife.com/admin/states' element={<ViewState />} />
      <Route path='/SecureLife.com/admin/states/:id/cities' element={<ViewCity />} />
      <Route path='/SecureLife.com/admin/cities/new' element={<AddCity/>}/>
      <Route path='/SecureLife.com/admin/states/new' element={<AddState />}/>
      <Route path='/SecureLife.com/admin/admins/new' element={<AddAdmin />}/>
      <Route path='/SecureLife.com/admin/employees/new' element={<AddEmployee />}/>
      <Route path='/SecureLife.com/admin/agents/new' element={<AddAgent />}/>
      <Route path='/SecureLife.com/admin/withdrawals' element={<ViewWithdrawals/>}/>
      <Route path='/SecureLife.com/admin/claims' element={<ViewClaims/>}/>
      <Route path="/SecureLife.com/admin/claims/:claimId/documents" element={<ClaimDoc/>}/>
      <Route path='/SecureLife.com/admin/types' element={<ViewInsuranceType/>}/>
      <Route path='/SecureLife.com/admin/types/:typeId/schemes' element={<ViewScheme/>}/>
      <Route path='/SecureLife.com/admin/types/:typeId/schemes/new' element={<AddSchemeForm/>}/>
      <Route path="/SecureLife.com/admin/schemes/:schemeId/plan" element={<InsurancePlanForm/>}/>
      <Route path='/SecureLife.com/admin/types/new' element={<AddInsuranceTypeForm/>}/>
      <Route path="/SecureLife.com/admin/schemes/:schemeId/update" element={<UpdateSchemeForm />}/>


      <Route path="/SecureLife.com/agent/dashboard" element={<AgentDashboard />} />
      <Route path='/SecureLife.com/agent/commissions' element={<MyCommissions/>}/>
      <Route path='/SecureLife.com/agent/customers' element={<MyClients/>}/>
      <Route path='/SecureLife.com/agent/withdrawals' element={<MyWithdrawals/>}/>

      <Route path="/SecureLife.com/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/SecureLife.com/employee/agents/new" element={<AddAgentForm/>}/>
      <Route path="/SecureLife.com/employee/agents" element={<ViewAgentsTable/>}/>
      <Route path="/SecureLife.com/employee/agents/:agentId/update" element={<UpdateAgentForm />} />
      <Route path="/SecureLife.com/employee/customers" element={<ViewCustomers />} />
      <Route path="/SecureLife.com/employee/customers/:customerId/documents" element={<CustomerDoc/>}/>
      <Route path="/SecureLife.com/employee/customers/:customerId/update" element={<CustomerUpdateForm/>} />
      <Route path="/SecureLife.com/employee/queries" element={<ViewQueriesForEmployee/>} />

      <Route path="/SecureLife.com/customer/queries" element={<ViewQueries/>} />
      <Route path="/SecureLife.com/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/SecureLife.com/customer/mypolicies" element={<ViewPolicyTable/>} />
      <Route path="/SecureLife.com/customer/policies/:policyId/installments" element={<ViewInstallmentTable/>} />
      <Route path="/SecureLife.com/user/types/:typeId" element={<InsuranceSchemesByType/>} /> 
      <Route path="/SecureLife.com/user/schemes/:schemeId" element={<InsurancePlansByScheme />} />

    </Routes>

  );
};

export default App;
