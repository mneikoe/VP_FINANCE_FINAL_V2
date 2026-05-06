import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiEye, FiX, FiTrash2 } from "react-icons/fi";
import axios from "../../../config/axios";
import { toast } from "react-toastify";

const RewardIncentiveTable = () => {
  const [incentives, setIncentives] = useState([
    {
      _id: "mock-rew-1",
      employeeName: "Suresh Gupta",
      taskCategory: "Lead Generation",
      taskName: "Cold Calling 50+",
      financialProduct: "General Insurance",
      companyName: "ICICI Lombard",
      rewardPoints: 150,
      incentiveAmount: 1500,
      deductions: 50,
      netIncentivePayable: 1450,
      bankAccount: "5544332211",
      transferDate: new Date(),
      month: "May 2026",
    },
    {
      _id: "mock-rew-2",
      employeeName: "Karan Johar",
      taskCategory: "Client Meeting",
      taskName: "In-person Visit",
      financialProduct: "Tax Saver FD",
      companyName: "SBI Bank",
      rewardPoints: 200,
      incentiveAmount: 2000,
      deductions: 0,
      netIncentivePayable: 2000,
      bankAccount: "9900887766",
      transferDate: null,
      month: "May 2026",
    }
  ]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIncentive, setSelectedIncentive] = useState(null);
  const [formData, setFormData] = useState({
    employeeRef: "",
    taskCategory: "",
    taskName: "",
    financialProduct: "",
    companyName: "",
    rewardPoints: 0,
    incentiveAmount: 0,
    deductions: 0,
    netIncentivePayable: 0,
    bankAccount: "",
    transferDate: "",
    month: "May 2026",
    year: 2026,
  });

  useEffect(() => {
    fetchIncentives();
    fetchEmployees();
  }, []);

  const fetchIncentives = async () => {
    try {
      const res = await axios.get(`/api/incentives/reward?search=${searchTerm}`);
      if (res.data.success && res.data.data.length > 0) setIncentives(res.data.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employee/all");
      if (res.data.success) setEmployees(res.data.data);
    } catch (error) { console.error(error); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "incentiveAmount" || name === "deductions") {
      updated.netIncentivePayable = (parseFloat(updated.incentiveAmount) || 0) - (parseFloat(updated.deductions) || 0);
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedIncentive) {
        await axios.put(`/api/incentives/reward/${selectedIncentive._id}`, formData);
        toast.success("Updated successfully");
      } else {
        await axios.post("/api/incentives/reward", formData);
        toast.success("Added successfully");
      }
      setIsModalOpen(false);
      fetchIncentives();
    } catch (error) { toast.error("Operation failed"); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Reward Based Incentive</h2>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setSelectedIncentive(null); setFormData({ ...formData, employeeRef: "" }); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <FiPlus /> Add Reward Incentive
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[1500px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
              <th className="px-4 py-3 border-r sticky left-0 bg-gray-100 z-10">Employee Name</th>
              <th className="px-4 py-3 border-r">Task Category</th>
              <th className="px-4 py-3 border-r">Task Name</th>
              <th className="px-4 py-3 border-r">Financial Product</th>
              <th className="px-4 py-3 border-r">Company Name</th>
              <th className="px-4 py-3 border-r text-center">Reward Points</th>
              <th className="px-4 py-3 border-r text-center">Incentive Amount</th>
              <th className="px-4 py-3 border-r text-center">Deductions</th>
              <th className="px-4 py-3 border-r text-center font-bold">Net Payable</th>
              <th className="px-4 py-3 border-r">Bank A/C</th>
              <th className="px-4 py-3 border-r text-center">Transfer Date</th>
              <th className="px-4 py-3 text-center sticky right-0 bg-gray-100 z-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incentives.map((row) => (
              <tr key={row._id} className="hover:bg-blue-50/30">
                <td className="px-4 py-3 border-r sticky left-0 bg-white z-0 font-medium">{row.employeeRef?.name || row.employeeName}</td>
                <td className="px-4 py-3 border-r">{row.taskCategory}</td>
                <td className="px-4 py-3 border-r">{row.taskName}</td>
                <td className="px-4 py-3 border-r">{row.financialProduct}</td>
                <td className="px-4 py-3 border-r">{row.companyName}</td>
                <td className="px-4 py-3 border-r text-center font-bold text-amber-600">{row.rewardPoints} pts</td>
                <td className="px-4 py-3 border-r text-center">₹{row.incentiveAmount}</td>
                <td className="px-4 py-3 border-r text-center text-red-500">-₹{row.deductions}</td>
                <td className="px-4 py-3 border-r text-center font-black text-indigo-700">₹{row.netIncentivePayable}</td>
                <td className="px-4 py-3 border-r">{row.bankAccount}</td>
                <td className="px-4 py-3 border-r text-center">{row.transferDate ? new Date(row.transferDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 text-center sticky right-0 bg-white z-0 flex gap-2 justify-center">
                  <button onClick={() => { setSelectedIncentive(row); setIsViewModalOpen(true); }} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><FiEye /></button>
                  <button onClick={() => { setSelectedIncentive(row); setFormData({ ...row, employeeRef: row.employeeRef?._id || "" }); setIsModalOpen(true); }} className="text-amber-600 hover:bg-amber-50 p-1 rounded"><FiEdit2 /></button>
                  <button onClick={async () => { if(window.confirm("Delete?")) { await axios.delete(`/api/incentives/reward/${row._id}`); fetchIncentives(); } }} className="text-red-600 hover:bg-red-50 p-1 rounded"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b bg-orange-500 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Reward Incentive Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Employee</label>
                <select name="employeeRef" value={formData.employeeRef} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50">
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Task Category</label>
                <input type="text" name="taskCategory" value={formData.taskCategory} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Task Name</label>
                <input type="text" name="taskName" value={formData.taskName} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Financial Product</label>
                <input type="text" name="financialProduct" value={formData.financialProduct} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Reward Points</label>
                <input type="number" name="rewardPoints" value={formData.rewardPoints} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Incentive Amount</label>
                <input type="number" name="incentiveAmount" value={formData.incentiveAmount} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Deductions</label>
                <input type="number" name="deductions" value={formData.deductions} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Bank A/C</label>
                <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Transfer Date</label>
                <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>

              <div className="md:col-span-3 bg-gray-50 p-4 rounded-xl flex justify-center items-center mt-4 border border-dashed border-orange-200">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Net Payable Reward Incentive</p>
                  <p className="text-3xl font-black text-indigo-700">₹{formData.netIncentivePayable}</p>
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-orange-500 text-white rounded-lg font-bold shadow-lg shadow-orange-200">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedIncentive && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b bg-gray-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedIncentive.employeeRef?.name || selectedIncentive.employeeName}</h3>
                <p className="text-xs text-gray-400">Reward Based Incentive • {selectedIncentive.month}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><FiX size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task Details</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Category</span> <span className="font-bold">{selectedIncentive.taskCategory}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Task Name</span> <span className="font-bold">{selectedIncentive.taskName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Points</span> <span className="font-bold text-amber-600">{selectedIncentive.rewardPoints} pts</span></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financial Product</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Product</span> <span className="font-bold">{selectedIncentive.financialProduct}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Company</span> <span className="font-bold">{selectedIncentive.companyName}</span></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Calculation</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Gross Incentive</span> <span className="font-bold">₹{selectedIncentive.incentiveAmount}</span></div>
                      <div className="flex justify-between text-red-600"><span className="text-gray-500">Deductions</span> <span className="font-bold">-₹{selectedIncentive.deductions}</span></div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Net Payable</p>
                    <p className="text-3xl font-black text-indigo-700 mt-1">₹{selectedIncentive.netIncentivePayable}</p>
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase">Payment Status</p>
                      <p className="text-xs font-bold text-indigo-900">{selectedIncentive.transferDate ? `Paid on ${new Date(selectedIncentive.transferDate).toLocaleDateString()}` : "Pending"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-8 py-2 bg-gray-900 text-white rounded-lg font-bold">Close Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardIncentiveTable;
