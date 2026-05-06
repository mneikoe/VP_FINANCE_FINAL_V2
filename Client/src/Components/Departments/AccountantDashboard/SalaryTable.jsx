import React, { useState, useEffect } from "react";
import { FiSearch, FiDownload, FiPlus, FiEdit2, FiEye, FiX, FiTrash2 } from "react-icons/fi";
import axios from "../../../config/axios";
import { toast } from "react-toastify";

const SalaryTable = () => {
  const [salaries, setSalaries] = useState([
    {
      _id: "mock1",
      employeeRef: { name: "Rajesh Kumar", employeeCode: "VP001" },
      basicSalary: 30000,
      monthDays: 30,
      workingDays: 28,
      perDayWages: 1000,
      netSalary: 28000,
      kmRun: 200,
      ratePerKm: 5,
      total: 500,
      exp: 200,
      totalSalaryEarned: 29700,
      securityDeposit: 1000,
      fine: 0,
      pf: 1800,
      advance: 500,
      salaryPayable: 26400,
      bankAccount: "1234567890",
      transferDate: new Date(),
      month: "May 2026",
    },
    {
      _id: "mock2",
      employeeRef: { name: "Sneha Sharma", employeeCode: "VP002" },
      basicSalary: 25000,
      monthDays: 30,
      workingDays: 26,
      perDayWages: 833.33,
      netSalary: 21666.58,
      kmRun: 150,
      ratePerKm: 5,
      total: 0,
      exp: 100,
      totalSalaryEarned: 22516.58,
      securityDeposit: 500,
      fine: 200,
      pf: 1500,
      advance: 0,
      salaryPayable: 20316.58,
      bankAccount: "0987654321",
      transferDate: null,
      month: "May 2026",
    }
  ]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [formData, setFormData] = useState({
    employeeRef: "",
    basicSalary: 0,
    monthDays: 30,
    workingDays: 0,
    perDayWages: 0,
    netSalary: 0,
    kmRun: 0,
    ratePerKm: 0,
    total: 0,
    exp: 0,
    totalSalaryEarned: 0,
    securityDeposit: 0,
    fine: 0,
    pf: 0,
    advance: 0,
    salaryPayable: 0,
    bankAccount: "",
    transferDate: "",
    month: "May 2026",
    year: 2026,
  });

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await axios.get(`/api/salary?search=${searchTerm}`);
      if (res.data.success && res.data.data.length > 0) {
        setSalaries(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/all");
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSalaries();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    // Auto-calculations
    if (name === "basicSalary" || name === "monthDays" || name === "workingDays") {
      const basic = parseFloat(updatedData.basicSalary) || 0;
      const mDays = parseFloat(updatedData.monthDays) || 1;
      const wDays = parseFloat(updatedData.workingDays) || 0;
      updatedData.perDayWages = (basic / mDays).toFixed(2);
      updatedData.netSalary = (updatedData.perDayWages * wDays).toFixed(2);
    }

    if (name === "kmRun" || name === "ratePerKm" || name === "total" || name === "exp" || name === "netSalary") {
      const net = parseFloat(updatedData.netSalary) || 0;
      const km = parseFloat(updatedData.kmRun) || 0;
      const rate = parseFloat(updatedData.ratePerKm) || 0;
      const tot = parseFloat(updatedData.total) || 0;
      const expVal = parseFloat(updatedData.exp) || 0;
      updatedData.totalSalaryEarned = (net + (km * rate) + tot + expVal).toFixed(2);
    }

    if (name === "securityDeposit" || name === "fine" || name === "pf" || name === "advance" || name === "totalSalaryEarned") {
      const earned = parseFloat(updatedData.totalSalaryEarned) || 0;
      const sec = parseFloat(updatedData.securityDeposit) || 0;
      const fine = parseFloat(updatedData.fine) || 0;
      const pf = parseFloat(updatedData.pf) || 0;
      const adv = parseFloat(updatedData.advance) || 0;
      updatedData.salaryPayable = (earned - (sec + fine + pf + adv)).toFixed(2);
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSalary) {
        await axios.put(`/api/salary/${selectedSalary._id}`, formData);
        toast.success("Salary updated successfully");
      } else {
        await axios.post("/api/salary", formData);
        toast.success("Salary added successfully");
      }
      setIsModalOpen(false);
      setSelectedSalary(null);
      fetchSalaries();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setFormData({
      employeeRef: "",
      basicSalary: 0,
      monthDays: 30,
      workingDays: 0,
      perDayWages: 0,
      netSalary: 0,
      kmRun: 0,
      ratePerKm: 0,
      total: 0,
      exp: 0,
      totalSalaryEarned: 0,
      securityDeposit: 0,
      fine: 0,
      pf: 0,
      advance: 0,
      salaryPayable: 0,
      bankAccount: "",
      transferDate: "",
      month: "May 2026",
      year: 2026,
    });
  };

  const handleEdit = (salary) => {
    setSelectedSalary(salary);
    setFormData({
      ...salary,
      employeeRef: salary.employeeRef._id,
      transferDate: salary.transferDate ? new Date(salary.transferDate).toISOString().split('T')[0] : ""
    });
    setIsModalOpen(true);
  };

  const handleView = (salary) => {
    setSelectedSalary(salary);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`/api/salary/${id}`);
        toast.success("Deleted successfully");
        fetchSalaries();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header Action Bar */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Salary Management - {formData.month}</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or code..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { resetForm(); setSelectedSalary(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <FiPlus /> Add Salary
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse min-w-[2000px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
              <th className="px-4 py-3 border-r sticky left-0 bg-gray-100 z-10" rowSpan="2">Employee Name</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Basic Salary</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Month Days</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Working Days</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Per Day Wages</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Net Salary</th>
              <th className="px-4 py-3 border-r text-center" colSpan="2">Allowance</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Total</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Exp</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Total Salary Earned</th>
              <th className="px-4 py-3 border-r text-center" colSpan="4">Deduction</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Salary Payable</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Bank A/C</th>
              <th className="px-4 py-3 border-r text-center" rowSpan="2">Transfer Date</th>
              <th className="px-4 py-3 text-center sticky right-0 bg-gray-100 z-10" rowSpan="2">Actions</th>
            </tr>
            <tr className="bg-gray-50 text-gray-600 font-medium border-b">
              <th className="px-4 py-2 border-r text-center text-xs">Km Run</th>
              <th className="px-4 py-2 border-r text-center text-xs">Rate Per KM</th>
              <th className="px-4 py-2 border-r text-center text-xs">Sec. Deposit</th>
              <th className="px-4 py-2 border-r text-center text-xs">Fine</th>
              <th className="px-4 py-2 border-r text-center text-xs">PF</th>
              <th className="px-4 py-2 border-r text-center text-xs">Advance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {salaries.map((row) => (
              <tr key={row._id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 border-r font-medium text-gray-900 sticky left-0 bg-white z-0 group-hover:bg-blue-50">
                  {row.employeeRef?.name}
                  <span className="block text-[10px] text-gray-400">{row.employeeRef?.employeeCode}</span>
                </td>
                <td className="px-4 py-3 border-r text-center">₹{row.basicSalary}</td>
                <td className="px-4 py-3 border-r text-center">{row.monthDays}</td>
                <td className="px-4 py-3 border-r text-center font-semibold text-blue-600">{row.workingDays}</td>
                <td className="px-4 py-3 border-r text-center text-gray-500">₹{row.perDayWages}</td>
                <td className="px-4 py-3 border-r text-center font-semibold">₹{row.netSalary}</td>
                <td className="px-4 py-3 border-r text-center text-blue-500">{row.kmRun}</td>
                <td className="px-4 py-3 border-r text-center text-orange-600">₹{row.ratePerKm}</td>
                <td className="px-4 py-3 border-r text-center text-gray-600">₹{row.total}</td>
                <td className="px-4 py-3 border-r text-center text-gray-600">₹{row.exp}</td>
                <td className="px-4 py-3 border-r text-center font-bold text-green-700 bg-green-50/50">₹{row.totalSalaryEarned}</td>
                <td className="px-4 py-3 border-r text-center text-red-600 font-medium bg-red-50/30">-{row.securityDeposit}</td>
                <td className="px-4 py-3 border-r text-center text-red-600 font-medium bg-red-50/30">-{row.fine}</td>
                <td className="px-4 py-3 border-r text-center text-red-600 font-medium bg-red-50/30">-{row.pf}</td>
                <td className="px-4 py-3 border-r text-center text-red-600 font-medium bg-red-50/30">-{row.advance}</td>
                <td className="px-4 py-3 border-r text-center font-black text-indigo-700 bg-indigo-50/50">₹{row.salaryPayable}</td>
                <td className="px-4 py-3 border-r text-center text-gray-500">{row.bankAccount}</td>
                <td className="px-4 py-3 border-r text-center text-gray-500">
                  {row.transferDate ? new Date(row.transferDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3 text-center sticky right-0 bg-white z-0 group-hover:bg-blue-50">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleView(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><FiEye /></button>
                    <button onClick={() => handleEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(row._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
              <h3 className="text-xl font-bold">{selectedSalary ? "Edit Salary Record" : "Add New Salary Record"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Employee</label>
                <select 
                  name="employeeRef" 
                  value={formData.employeeRef} 
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeCode})</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Basic Salary</label>
                <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Working Days</label>
                <input type="number" name="workingDays" value={formData.workingDays} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Km Run</label>
                <input type="number" name="kmRun" value={formData.kmRun} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Rate per KM</label>
                <input type="number" name="ratePerKm" value={formData.ratePerKm} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Total (Subtotal)</label>
                <input type="number" name="total" value={formData.total} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Exp</label>
                <input type="number" name="exp" value={formData.exp} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* Deductions */}
              <div className="md:col-span-3 border-t pt-4 mt-2">
                <h4 className="text-sm font-bold text-red-600 mb-3">Deductions</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Sec. Deposit</label>
                    <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Fine</label>
                    <input type="number" name="fine" value={formData.fine} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">PF</label>
                    <input type="number" name="pf" value={formData.pf} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Advance</label>
                    <input type="number" name="advance" value={formData.advance} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="md:col-span-3 border-t pt-4 mt-2">
                <h4 className="text-sm font-bold text-blue-600 mb-3">Bank & Payment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bank A/C</label>
                    <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Transfer Date</label>
                    <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="md:col-span-3 bg-gray-50 p-4 rounded-xl mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Per Day</p>
                  <p className="text-lg font-black text-gray-700">₹{formData.perDayWages}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Net Salary</p>
                  <p className="text-lg font-black text-blue-600">₹{formData.netSalary}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Total Earned</p>
                  <p className="text-lg font-black text-green-600">₹{formData.totalSalaryEarned}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Payable</p>
                  <p className="text-xl font-black text-indigo-700 underline underline-offset-4 decoration-2">₹{formData.salaryPayable}</p>
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Save Salary</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedSalary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
              <div>
                <h3 className="text-xl font-bold">{selectedSalary.employeeRef?.name}</h3>
                <p className="text-xs text-gray-400">{selectedSalary.employeeRef?.employeeCode} • {selectedSalary.month}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><FiX size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Basic Financials</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Basic Salary</span> <span className="font-bold">₹{selectedSalary.basicSalary}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Working Days</span> <span className="font-bold">{selectedSalary.workingDays}/{selectedSalary.monthDays}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Per Day</span> <span className="font-bold">₹{selectedSalary.perDayWages}</span></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Deductions</p>
                    <div className="mt-2 space-y-2 text-red-600">
                      <div className="flex justify-between"><span>Sec. Deposit</span> <span className="font-bold">₹{selectedSalary.securityDeposit}</span></div>
                      <div className="flex justify-between"><span>Fine / Advance</span> <span className="font-bold">₹{selectedSalary.fine + selectedSalary.advance}</span></div>
                      <div className="flex justify-between"><span>PF</span> <span className="font-bold">₹{selectedSalary.pf}</span></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Earnings & Addons</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Allowance (KM)</span> <span className="font-bold">₹{selectedSalary.kmRun * selectedSalary.ratePerKm}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Total/Other</span> <span className="font-bold">₹{selectedSalary.total}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Exp Reimbursement</span> <span className="font-bold">₹{selectedSalary.exp}</span></div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Net Payable</p>
                    <p className="text-3xl font-black text-indigo-700 mt-1">₹{selectedSalary.salaryPayable}</p>
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <p className="text-[10px] text-indigo-400 font-bold">BANK A/C</p>
                      <p className="text-sm font-bold text-indigo-900">{selectedSalary.bankAccount || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-8 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all">Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;
