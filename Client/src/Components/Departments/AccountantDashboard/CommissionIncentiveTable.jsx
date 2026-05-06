import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiEye, FiX, FiTrash2 } from "react-icons/fi";
import axios from "../../../config/axios";
import { toast } from "react-toastify";

const CommissionIncentiveTable = () => {
  const [incentives, setIncentives] = useState([
    {
      _id: "mock-comm-1",
      leadSource: "Direct Marketing",
      leadName: "Campaign A",
      clientName: "Amit Sharma",
      financialProduct: "Life Insurance",
      companyName: "LIC India",
      plan: "Jeevan Anand",
      doc: "PO-12345",
      mode: "Yearly",
      premiumAmount: 50000,
      rateOfIncentive: 5,
      incentiveAmount: 2500,
      deductions: 100,
      netIncentivePayable: 2400,
      nextDueDate: "2027-05-15",
      bankAccount: "9876543210",
      transferDate: new Date(),
      month: "May 2026",
    },
    {
      _id: "mock-comm-2",
      leadSource: "Referral",
      leadName: "B. Verma",
      clientName: "Priya Singh",
      financialProduct: "Mutual Fund",
      companyName: "HDFC AMC",
      plan: "Growth Fund",
      doc: "MF-9988",
      mode: "SIP",
      premiumAmount: 10000,
      rateOfIncentive: 2,
      incentiveAmount: 200,
      deductions: 0,
      netIncentivePayable: 200,
      nextDueDate: "2026-06-01",
      bankAccount: "1122334455",
      transferDate: null,
      month: "May 2026",
    }
  ]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIncentive, setSelectedIncentive] = useState(null);
  const [formData, setFormData] = useState({
    leadSource: "",
    leadName: "",
    clientRef: "",
    financialProduct: "",
    companyName: "",
    plan: "",
    doc: "",
    mode: "",
    premiumAmount: 0,
    rateOfIncentive: 0,
    incentiveAmount: 0,
    deductions: 0,
    netIncentivePayable: 0,
    nextDueDate: "",
    bankAccount: "",
    transferDate: "",
    month: "May 2026",
    year: 2026,
  });

  useEffect(() => {
    fetchIncentives();
    fetchClients();
  }, []);

  const fetchIncentives = async () => {
    try {
      const res = await axios.get(`/api/incentives/commission?search=${searchTerm}`);
      if (res.data.success && res.data.data.length > 0) setIncentives(res.data.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("/api/client");
      if (res.data.success) setClients(res.data.data);
    } catch (error) { console.error(error); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    
    if (name === "premiumAmount" || name === "rateOfIncentive" || name === "deductions") {
      const prem = parseFloat(updated.premiumAmount) || 0;
      const rate = parseFloat(updated.rateOfIncentive) || 0;
      const ded = parseFloat(updated.deductions) || 0;
      updated.incentiveAmount = ((prem * rate) / 100).toFixed(2);
      updated.netIncentivePayable = (updated.incentiveAmount - ded).toFixed(2);
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedIncentive) {
        await axios.put(`/api/incentives/commission/${selectedIncentive._id}`, formData);
        toast.success("Updated successfully");
      } else {
        await axios.post("/api/incentives/commission", formData);
        toast.success("Added successfully");
      }
      setIsModalOpen(false);
      fetchIncentives();
    } catch (error) { toast.error("Operation failed"); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Commission Based Incentive</h2>
        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search client..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setFormData({ ...formData, clientRef: "" }); setSelectedIncentive(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <FiPlus /> Add Calculation
          </button>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse min-w-[2000px]">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
              <th className="px-4 py-3 border-r sticky left-0 bg-gray-100 z-10">Lead Source</th>
              <th className="px-4 py-3 border-r">Lead Name</th>
              <th className="px-4 py-3 border-r">Name of Client</th>
              <th className="px-4 py-3 border-r">Financial Product</th>
              <th className="px-4 py-3 border-r">Company Name</th>
              <th className="px-4 py-3 border-r">Plan</th>
              <th className="px-4 py-3 border-r">Doc</th>
              <th className="px-4 py-3 border-r">Mode</th>
              <th className="px-4 py-3 border-r text-center">Premium Amount</th>
              <th className="px-4 py-3 border-r text-center">Rate (%)</th>
              <th className="px-4 py-3 border-r text-center">Incentive Amt</th>
              <th className="px-4 py-3 border-r text-center">Deductions</th>
              <th className="px-4 py-3 border-r text-center">Net Payable</th>
              <th className="px-4 py-3 border-r text-center">Next Due Date</th>
              <th className="px-4 py-3 border-r">Bank A/C</th>
              <th className="px-4 py-3 border-r text-center">Transfer Date</th>
              <th className="px-4 py-3 text-center sticky right-0 bg-gray-100 z-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incentives.map((row) => (
              <tr key={row._id} className="hover:bg-blue-50/30">
                <td className="px-4 py-3 border-r sticky left-0 bg-white z-0">{row.leadSource}</td>
                <td className="px-4 py-3 border-r">{row.leadName}</td>
                <td className="px-4 py-3 border-r font-medium text-blue-600">{row.clientRef?.name || row.clientName}</td>
                <td className="px-4 py-3 border-r">{row.financialProduct}</td>
                <td className="px-4 py-3 border-r">{row.companyName}</td>
                <td className="px-4 py-3 border-r">{row.plan}</td>
                <td className="px-4 py-3 border-r">{row.doc}</td>
                <td className="px-4 py-3 border-r">{row.mode}</td>
                <td className="px-4 py-3 border-r text-center">₹{row.premiumAmount}</td>
                <td className="px-4 py-3 border-r text-center">{row.rateOfIncentive}%</td>
                <td className="px-4 py-3 border-r text-center font-bold text-green-600">₹{row.incentiveAmount}</td>
                <td className="px-4 py-3 border-r text-center text-red-500">-₹{row.deductions}</td>
                <td className="px-4 py-3 border-r text-center font-black text-indigo-700">₹{row.netIncentivePayable}</td>
                <td className="px-4 py-3 border-r text-center">{row.nextDueDate ? new Date(row.nextDueDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 border-r">{row.bankAccount}</td>
                <td className="px-4 py-3 border-r text-center">{row.transferDate ? new Date(row.transferDate).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 text-center sticky right-0 bg-white z-0 flex gap-2 justify-center">
                  <button onClick={() => { setSelectedIncentive(row); setIsViewModalOpen(true); }} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><FiEye /></button>
                  <button onClick={() => { setSelectedIncentive(row); setFormData({ ...row, clientRef: row.clientRef?._id || "" }); setIsModalOpen(true); }} className="text-amber-600 hover:bg-amber-50 p-1 rounded"><FiEdit2 /></button>
                  <button onClick={async () => { if(window.confirm("Delete?")) { await axios.delete(`/api/incentives/commission/${row._id}`); fetchIncentives(); } }} className="text-red-600 hover:bg-red-50 p-1 rounded"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Commission Incentive Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Client (from OA)</label>
                <select name="clientRef" value={formData.clientRef} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50">
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Lead Source</label>
                <input type="text" name="leadSource" value={formData.leadSource} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Lead Name</label>
                <input type="text" name="leadName" value={formData.leadName} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
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
                <label className="text-xs font-bold text-gray-500 uppercase">Plan</label>
                <input type="text" name="plan" value={formData.plan} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Premium Amount</label>
                <input type="number" name="premiumAmount" value={formData.premiumAmount} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Rate of Incentive (%)</label>
                <input type="number" name="rateOfIncentive" value={formData.rateOfIncentive} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Deductions</label>
                <input type="number" name="deductions" value={formData.deductions} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Next Due Date</label>
                <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Bank A/C</label>
                <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Transfer Date</label>
                <input type="date" name="transferDate" value={formData.transferDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
              </div>

              <div className="md:col-span-3 bg-gray-50 p-4 rounded-xl flex justify-between items-center mt-4 border border-dashed border-blue-200">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Incentive Amount</p>
                  <p className="text-xl font-black text-green-600">₹{formData.incentiveAmount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Net Payable</p>
                  <p className="text-2xl font-black text-indigo-700">₹{formData.netIncentivePayable}</p>
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200">Save</button>
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
                <h3 className="text-xl font-bold">{selectedIncentive.clientRef?.name || selectedIncentive.clientName}</h3>
                <p className="text-xs text-gray-400">Commission Based Incentive • {selectedIncentive.month}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><FiX size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Policy Details</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Product</span> <span className="font-bold">{selectedIncentive.financialProduct}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Company</span> <span className="font-bold">{selectedIncentive.companyName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Plan</span> <span className="font-bold">{selectedIncentive.plan}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Mode</span> <span className="font-bold">{selectedIncentive.mode}</span></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lead Info</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Source</span> <span className="font-bold">{selectedIncentive.leadSource}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Lead Name</span> <span className="font-bold">{selectedIncentive.leadName}</span></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Earnings</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Premium</span> <span className="font-bold">₹{selectedIncentive.premiumAmount}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Rate</span> <span className="font-bold">{selectedIncentive.rateOfIncentive}%</span></div>
                      <div className="flex justify-between text-green-600 font-bold"><span className="text-gray-500">Incentive</span> <span>₹{selectedIncentive.incentiveAmount}</span></div>
                      <div className="flex justify-between text-red-500 font-bold"><span className="text-gray-500">Deductions</span> <span>-₹{selectedIncentive.deductions}</span></div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Net Payable</p>
                    <p className="text-3xl font-black text-indigo-700 mt-1">₹{selectedIncentive.netIncentivePayable}</p>
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase">Due Date</p>
                      <p className="text-sm font-bold text-indigo-900">{selectedIncentive.nextDueDate ? new Date(selectedIncentive.nextDueDate).toLocaleDateString() : "N/A"}</p>
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

export default CommissionIncentiveTable;
