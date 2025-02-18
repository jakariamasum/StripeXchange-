"use client";

import { useState } from "react";
import type { WithdrawalRequest } from "@prisma/client";
import { Button } from "./ui/Button";
import { Modal } from "./modal/Modal";

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
      // First, update the withdrawal request status
      const response = await fetch(
        `/api/admin/${action}-withdrawal/${selectedRequest.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} withdrawal request`);
      }

      // If approved, update the user's balance
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
      // Refresh the page to update the list
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
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
          <tbody className="text-gray-600 text-sm font-light">
            {withdrawalRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {request.id}
                </td>
                <td className="py-3 px-6 text-left">{request.user.email}</td>
                <td className="py-3 px-6 text-left">{request.amount}</td>
                <td className="py-3 px-6 text-left">{request.currency}</td>
                <td className="py-3 px-6 text-left">{request.accountNumber}</td>
                <td className="py-3 px-6 text-left">{request.status}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(request.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="primary"
                        className="mr-2"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAction("approve");
                          setIsModalOpen(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAction("reject");
                          setIsModalOpen(true);
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        title={`Confirm ${action === "approve" ? "Approval" : "Rejection"}`}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to {action} this withdrawal request for{" "}
            {selectedRequest?.amount} {selectedRequest?.currency}?
          </p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => !isProcessing && setIsModalOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={action === "approve" ? "primary" : "danger"}
            onClick={handleAction}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Confirm ${action}`}
          </Button>
        </div>
      </Modal>
    </>
  );
}
