import {
  FiLayers,
  FiUser,
  FiUsers,
  FiTrendingUp,
  FiBriefcase,
  FiCheckSquare,
  FiFileText,
  FiAward,
  FiShoppingCart,
  FiDollarSign,
  FiHome,
  FiX,
} from "react-icons/fi";
import { Landmark } from "lucide-react";

export const oaMenuConfig = {
  masters: {
    label: "Masters",
    icon: FiLayers,
    width: "780px",
    sections: [
      {
        title: "Task ",
        items: [
          { name: "Composite Task", to: "/composite" },
          { name: "Marketing Task", to: "/marketing-task" },
          { name: "Servicing Task", to: "/servicing-task" },
        ],
      },
      {
        title: "Area ",
        items: [
          { name: "Add Area", to: "/area" },
          { name: "Add Sub Area", to: "/sub-area" },
        ],
      },
      {
        title: "Lead ",
        items: [
          { name: "Lead Source", to: "/lead-type" },
          { name: "Lead Name", to: "/lead-source" },
          { name: "Occupation Type", to: "/occupation-type" },
          { name: "Occupation Name", to: "/lead-occupation" },
          { name: "Calling Purpose", to: "/calling-purpose" },
        ],
      },
      {
        title: "Document",
        items: [
          { name: "Document Type", to: "/kycdocument" },
          { name: "Document Name ", to: "/kyc-document-name-master" },
        ],
      },
    ],
  },
  customers: {
    label: "Customers",
    icon: FiUser,
    width: "560px",
    sections: [
      {
        title: "Suspect",
        items: [
          { name: "Add Suspect", to: "/suspect/add" },
          { name: "Suspect List", to: "/suspect" },
          { name: "Import Lead", to: "/import-lead" },
        ],
      },
      {
        title: "Prospect",
        items: [
          { name: "Add Prospect", to: "/prospect/add" },
          { name: "Prospect List", to: "/prospect" },
        ],
      },
      {
        title: "Client",
        items: [
          { name: "Add Client", to: "/client/add" },
          { name: "Client List", to: "/client" },
        ],
      },
    ],
  },
  employee: {
    label: "Employee",
    icon: FiUsers,
    width: "720px",
    sections: [
      {
        title: "Office Admin",
        items: [
          { name: "Job Profile & Target", to: "/job-profile-target-admin" },
          { name: "All Employee", to: "/all-employee" },
        ],
      },
      {
        title: "Telecaller",
        items: [
          { name: "Job Profile & Target", to: "/job-profile-target-telecaller" },
        ],
      },
      {
        title: "CRE",
        items: [{ name: "Job Profile & Target", to: "/job-profile-target-cre" }],
      },
      {
        title: "HR",
        items: [
          { name: "HR Rules & Regulations", to: "/hr-rules" },
          { name: "Employee Training", to: "/employee-training" },
        ],
      },
      {
        title: "Telemarketer",
        items: [
          { name: "Job Profile & Target", to: "/job-profile-target-telemarketer" },
        ],
      },
      {
        title: "Office Executive",
        items: [
          { name: "Job Profile & Target", to: "/job-profile-target-office-executive" },
        ],
      },
    ],
  },
  financial: {
    label: "Financial",
    icon: FiTrendingUp,
    width: "360px",
    sections: [
      {
        title: "Financial Services",
        items: [
          { name: "Financial Products", to: "/financial-product-list" },
          { name: "Company Name", to: "/company-name" },
          { name: "MF Registrar", to: "/mutual-fund/registrar" },
          { name: "MF AMC Name", to: "/mutual-fund/amc" },
          { name: "Other Product", to: "/other-product" },
        ],
      },
    ],
  },
  depart: {
    label: "Department",
    icon: FiBriefcase,
    width: "780px",
    sections: [
      {
        title: "Marketing",
        items: [{ name: "Marketing Documents", to: "/marketing-documents" }],
      },
      {
        title: "Servicing",
        items: [{ name: "Servicing Documents", to: "/servicing-documents" }],
      },
      {
        title: "Office Records",
        items: [
          { name: "Office Diary", to: "/office-diary" },
          { name: "Office Purchase", to: "/office-purchase" },
          { name: "Important Documents", to: "/important-documents" },
        ],
      },
      {
        title: "CRM Activities",
        items: [
          { name: "CRM Advertisement Activities", to: "/crm-advertisement-activities" },
          { name: "CRM Creativity Activities", to: "/crm-creativity-activities" },
          { name: "CRM Relationship Activities", to: "/crm-relationship-activities" },
        ],
      },
    ],
  },
  task: {
    label: "Task",
    icon: FiCheckSquare,
    width: "400px",
    sections: [
      {
        title: "Task Categories",
        items: [
          { name: "Composite", to: "/task-composite" },
          { name: "Marketing", to: "/task-marketing" },
          { name: "Servicing", to: "/task-servicing" },
        ],
      },
      {
        title: "Task Assign",
        items: [
          { name: "Assign Task", to: "/task-assign" },
          { name: "Assign Appointments", to: "/appointment-assign" },
        ],
      },
    ],
  },
  reports: {
    label: "Reports",
    icon: FiFileText,
    width: "320px",
    sections: [
      {
        title: "Reports",
        items: [
          { name: "Employee Report", to: "/reports/employee-report" },
          { name: "Telecaller Report", to: "/reports/telecaller-report" },
          { name: "Financial Reports", to: "/financial-product-list" },
          { name: "Sales Reports", to: "/report-2" },
          { name: "Customer Reports", to: "/report-3" },
        ],
      },
    ],
  },
};

export const hrMenuConfig = {
  hrmodules: {
    label: "HR Modules",
    icon: FiBriefcase,
    width: "600px",
    sections: [
      {
        title: "Recruitment",
        items: [
          { name: "Vacancy Management", to: "/dashboard/vacancies" },
          { name: "Add Candidate", to: "/dashboard/add-candidate" },
          { name: "Career Enquiry", to: "/dashboard/career-enquiry" },
          { name: "Resume Shortlist", to: "/dashboard/resume-shortlist" },
        ],
      },
      {
        title: "Process",
        items: [
          { name: "Interview Process", to: "/dashboard/interview-process" },
          { name: "Joining Data", to: "/dashboard/joining-data" },
          { name: "Add Employee", to: "/dashboard/add-employee-from-candidates" },
        ],
      },
    ],
  },
  management: {
    label: "Management",
    icon: FiUsers,
    width: "400px",
    sections: [
      {
        title: "Employees",
        items: [
          { name: "All Employees", to: "/dashboard/all-employee" },
          { name: "Internship Students", to: "/dashboard/internship-students" },
        ],
      },
      {
        title: "Org",
        items: [
            { name: "Analytics", to: "/dashboard/analytics" },
            { name: "Business Associates", to: "/dashboard/business-associates" },
            { name: "Rules & Regulations", to: "/dashboard/rules-regulations" },
        ]
      }
    ],
  },
};

export const telecallerMenuConfig = {
    leads: {
        label: "Leads",
        icon: FiUsers,
        width: "500px",
        sections: [
            {
                title: "Inbound",
                items: [
                    { name: "Add Suspect", to: "/telecaller/suspect/add" },
                    { name: "Balance Leads", to: "/telecaller/balance-leads" },
                ]
            },
            {
                title: "Status",
                items: [
                    { name: "Calling Done", to: "/telecaller/calling-done" },
                    { name: "Forwarded Leads", to: "/telecaller/forwarded-leads" },
                    { name: "Rejected Leads", to: "/telecaller/rejected-leads" },
                ]
            }
        ]
    },
    active: {
        label: "Active Leads",
        icon: FiTrendingUp,
        width: "400px",
        sections: [
            {
                title: "Categories",
                items: [
                    { name: "Busy On Call", to: "/telecaller/busy-on-another-call" },
                    { name: "Call Later", to: "/telecaller/call-after-some-time" },
                    { name: "Not Picked", to: "/telecaller/call-not-picked" },
                    { name: "Others", to: "/telecaller/others" },
                ]
            }
        ]
    },
    rejected: {
        label: "Rejected",
        icon: FiX,
        width: "400px",
        sections: [
            {
                title: "Categories",
                items: [
                    { name: "Wrong Number", to: "/telecaller/wrong-number" },
                    { name: "Not Reachable", to: "/telecaller/not-reachable" },
                    { name: "Not Interested", to: "/telecaller/not-interested" },
                ]
            }
        ]
    }
};

export const accountantMenuConfig = {
    accounts: {
        label: "Accounts",
        icon: Landmark,
        width: "500px",
        sections: [
            {
                title: "Masters",
                items: [
                    { name: "Transaction Master", to: "/accountant/banks" },
                    { name: "Income Head", to: "/accountant/income-head" },
                    { name: "Expenses Head", to: "/accountant/expenses-head" },
                ]
            },
            {
                title: "Operations",
                items: [
                    { name: "Salary", to: "/accountant/salary" },
                    { name: "Office Purchase", to: "/accountant/office-purchase" },
                ]
            }
        ]
    },
    incentives: {
        label: "Incentives",
        icon: FiAward,
        width: "400px",
        sections: [
            {
                title: "Types",
                items: [
                    { name: "Commission Based", to: "/accountant/incentive/commission" },
                    { name: "Reward Based", to: "/accountant/incentive/reward" },
                ]
            }
        ]
    },
    reports: {
        label: "Reports",
        icon: FiFileText,
        width: "300px",
        sections: [
            {
                title: "Finance",
                items: [
                    { name: "Financial Reports", to: "/accountant/reports" },
                ]
            }
        ]
    }
};

export const rmMenuConfig = {
    crm: {
        label: "CRM",
        icon: FiUser,
        width: "500px",
        sections: [
            {
                title: "Customers",
                items: [
                    { name: "Customer Master", to: "/rm/customer-master" },
                    { name: "Assigned Suspects", to: "/rm/assigned-suspects" },
                ]
            },
            {
                title: "Activity",
                items: [
                    { name: "Task Summary", to: "/rm/task-summary" },
                    { name: "Area of Work", to: "/rm/area-of-work" },
                ]
            }
        ]
    },
    finance: {
        label: "Finance",
        icon: FiDollarSign,
        width: "400px",
        sections: [
            {
                title: "Earnings",
                items: [
                    { name: "Salary History", to: "/rm/salary-history" },
                    { name: "Incentive History", to: "/rm/incentive-history" },
                ]
            }
        ]
    }
};

export const oeMenuConfig = {
    tasks: {
        label: "Tasks",
        icon: FiCheckSquare,
        width: "400px",
        sections: [
            {
                title: "Work",
                items: [
                    { name: "Task Summary", to: "/oe/task-summary" },
                ]
            }
        ]
    },
    finance: {
        label: "Finance",
        icon: FiDollarSign,
        width: "400px",
        sections: [
            {
                title: "Earnings",
                items: [
                    { name: "Salary History", to: "/oe/salary-history" },
                    { name: "Incentive History", to: "/oe/incentive-history" },
                ]
            }
        ]
    }
};
