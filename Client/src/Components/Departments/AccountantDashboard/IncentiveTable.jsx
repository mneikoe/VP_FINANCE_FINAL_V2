import React, { useState } from "react";
import { FiSearch, FiDownload, FiPlus } from "react-icons/fi";

const IncentiveTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const incentiveData = [
    {
      id: 1,
      employeeName: "John Doe",
      targetAchieved: "110%",
      incentiveAmount: 5000,
      status: "Approved",
      date: "2026-05-01",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Incentive Management</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <FiPlus /> Add Incentive
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
              <th className="px-4 py-3 border-r">Employee Name</th>
              <th className="px-4 py-3 border-r text-center">Target Achieved</th>
              <th className="px-4 py-3 border-r text-center">Incentive Amount</th>
              <th className="px-4 py-3 border-r text-center">Date</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incentiveData.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 border-r font-medium text-gray-900">{row.employeeName}</td>
                <td className="px-4 py-3 border-r text-center text-blue-600 font-semibold">{row.targetAchieved}</td>
                <td className="px-4 py-3 border-r text-center font-bold text-green-700">₹{row.incentiveAmount.toLocaleString()}</td>
                <td className="px-4 py-3 border-r text-center text-gray-500">{row.date}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncentiveTable;
