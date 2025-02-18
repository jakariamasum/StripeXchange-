"use client";

import { useState } from "react";
import type { WithdrawalRequest } from "@prisma/client";

interface AdminDashboardProps {
  withdrawalRequests: (WithdrawalRequest & { user: { email: string } })[];
}

export function AdminDashboard({ withdrawalRequests }: AdminDashboardProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async () => {
    if (!selectedRequest || !action) return;

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/${action}-withdrawal/${selectedRequest.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: selectedRequest.userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} withdrawal request`);
      }

      if (action === "approve") {
        const balanceResponse = await fetch("/api/user/update-balance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: selectedRequest.amount,
            currency: selectedRequest.currency,
            type: "subtract",
            userId: selectedRequest.userId,
          }),
        });

        if (!balanceResponse.ok) {
          throw new Error("Failed to update user balance");
        }
      }

      setIsModalOpen(false);
      setSelectedRequest(null);
      setAction(null);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Currency</th>
              <th className="py-3 px-6 text-left">Account Number</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {withdrawalRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {request.id}
                </td>
                <td className="py-3 px-6 text-left">{request.user.email}</td>
                <td className="py-3 px-6 text-left">{request.amount}</td>
                <td className="py-3 px-6 text-left">{request.currency}</td>
                <td className="py-3 px-6 text-left">{request.accountNumber}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      request.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : request.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAction("approve");
                          setIsModalOpen(true);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAction("reject");
                          setIsModalOpen(true);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm {action === "approve" ? "Approval" : "Rejection"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to {action} this withdrawal request for{" "}
                  {selectedRequest?.amount} {selectedRequest?.currency}?
                </p>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className={`px-4 py-2 ${
                    action === "approve"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white text-base font-medium rounded-md w-full shadow-sm hover:shadow-lg transition duration-300`}
                  onClick={handleAction}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Confirm ${action}`}
                </button>
                <button
                  className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:shadow-lg transition duration-300"
                  onClick={() => !isProcessing && setIsModalOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
