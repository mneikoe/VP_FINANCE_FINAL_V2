import React, { useState } from "react";
import { FiSearch, FiDownload, FiPlus } from "react-icons/fi";
import { Table, ConfigProvider } from "antd";

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
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition">
            <FiPlus /> Add Incentive
          </button>
        </div>
      </div>

      <div className="overflow-x-auto p-4 custom-scrollbar">
        <ConfigProvider theme={{ token: { colorPrimary: '#f27405' } }}>
          <Table
            dataSource={incentiveData}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 10 }}
            size="small"
            bordered
            columns={[
              { title: 'Employee Name', dataIndex: 'employeeName', render: v => <span className="font-medium text-gray-900">{v}</span> },
              { title: 'Target Achieved', dataIndex: 'targetAchieved', align: 'center', render: v => <span className="text-orange-600 font-semibold">{v}</span> },
              { title: 'Incentive Amount', dataIndex: 'incentiveAmount', align: 'center', render: v => <span className="font-bold text-green-700">₹{v.toLocaleString()}</span> },
              { title: 'Date', dataIndex: 'date', align: 'center', render: v => <span className="text-gray-500">{v}</span> },
              { title: 'Status', dataIndex: 'status', align: 'center', render: v => (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                    {v}
                  </span>
                ) 
              }
            ]}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default IncentiveTable;
