import React, { useState } from 'react';
import { useGetContactQuery } from '../redux/authApi/contactApi';
import { FiFilter } from 'react-icons/fi';

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-5"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
    <td className="py-4"><div className="h-4 bg-gray-300 rounded w-24"></div></td>
    <td className="py-4"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
    <td className="py-4"><div className="h-4 bg-gray-300 rounded w-28"></div></td>
    <td className="py-4"><div className="h-4 bg-gray-300 rounded w-24"></div></td>
  </tr>
);

const SkeletonCard = () => (
  <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
  </div>
);

const RecentOrdersTable = ({ searchQuery }) => {
  const { data, isLoading, isError } = useGetContactQuery();
  const [filterBy, setFilterBy] = useState(""); // filter state

  const enquiries = data?.enquiries || [];

  // Filter by search query first
  let filteredEnquiries = enquiries.filter((item) => {
    const query = (searchQuery || "").toLowerCase()
    const name = item.name?.toLowerCase() || "";
    const phone = item.contact?.toString() || "";
    const id = item._id?.toLowerCase() || "";
    return name.includes(query) || phone.includes(query) || id.includes(query);
  });

  // Filter by select option (today, week, month)
  if (filterBy) {
    const now = new Date();
    filteredEnquiries = filteredEnquiries.filter((item) => {
      const createdAt = new Date(item.createdAt);
      if (filterBy === "today") {
        return createdAt.toDateString() === now.toDateString();
      } else if (filterBy === "week") {
        // Get start of week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Get end of week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return createdAt >= startOfWeek && createdAt <= endOfWeek;
      } else if (filterBy === "month") {
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }

  const recentEnquiries = filteredEnquiries.slice(0, 10);

  return (
    <div className="px-3">
      <div className="text-end p-2">
        <div className="relative inline-block">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="appearance-none px-4 py-2 pr-10 rounded-lg
      bg-gray-100 text-black text-sm
      border border-[#1f2a5a]
      focus:outline-none focus:ring-2 focus:ring-[#A9FF67]"
          >
            <option value="">Filter by</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <FiFilter
            className="absolute right-3 top-1/2 -translate-y-1/2
            text-gray-600 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="p-2 sm:py-2 max-w-8xl mx-auto border rounded-lg shadow-xl">

        {/* DESKTOP TABLE */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full rounded-lg">
            <thead className="text-amber-900">
              <tr className='bg-[#A9FF67]'>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Contact ID</th>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Name</th>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Contact</th>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Amount</th>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Email</th>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Message</th>
                <th className="py-2 text-center text-[#2D461D] text-lg font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-red-500">
                    Error loading data
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((item) => (
                  <tr key={item._id}>
                    <td className="py-5 text-center text-gray-800">{item._id.slice(-6)}</td>
                    <td className="py-4 text-center text-gray-800">{item.name}</td>
                    <td className="py-4 text-center text-gray-800">{item.contact}</td>
                    <td className="py-4 text-center text-gray-800">₹{item.investmentAmount}</td>
                    <td className="py-4 text-center text-gray-800">{item.email}</td>
                    <td className="py-4 text-center text-gray-800">{item.message}</td>
                    <td className="py-4 text-center text-gray-800">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="sm:hidden flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : recentEnquiries.map((item) => (
              <div key={item._id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                <p><span className="font-semibold text-amber-900">Order ID:</span> {item._id.slice(-6)}</p>
                <p><span className="font-semibold text-amber-900">Customer:</span> {item.name}</p>
                <p><span className="font-semibold text-amber-900">Amount:</span> ₹{item.investmentAmount}</p>
                <p><span className="font-semibold text-amber-900">Email:</span> {item.email}</p>
                <p><span className="font-semibold text-amber-900">Contact:</span> {item.contact}</p>
                <p><span className="font-semibold text-amber-900">Date:</span> {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
