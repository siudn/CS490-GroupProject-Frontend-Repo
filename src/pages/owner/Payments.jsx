import { useState } from "react";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/ui/table";

export default function Payments() {
  // Mock data - will be replaced with API calls in Phase 7
  const [payments] = useState([
    {
      id: 1,
      date: "2025-01-15",
      customer: "John Smith",
      service: "Haircut",
      amount: 45,
      status: "paid",
      paymentMethod: "card",
    },
    {
      id: 2,
      date: "2025-01-14",
      customer: "Sarah Johnson",
      service: "Hair Coloring",
      amount: 120,
      status: "paid",
      paymentMethod: "card",
    },
    {
      id: 3,
      date: "2025-01-13",
      customer: "Mike Chen",
      service: "Haircut",
      amount: 50,
      status: "paid",
      paymentMethod: "card",
    },
    {
      id: 4,
      date: "2025-01-12",
      customer: "Emma Davis",
      service: "Beard Trim",
      amount: 25,
      status: "paid",
      paymentMethod: "cash",
    },
    {
      id: 5,
      date: "2025-01-11",
      customer: "Alex Rivera",
      service: "Haircut",
      amount: 45,
      status: "unpaid",
      paymentMethod: null,
    },
  ]);

  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  const filteredPayments = payments.filter((payment) => {
    if (dateFilter.start && payment.date < dateFilter.start) return false;
    if (dateFilter.end && payment.date > dateFilter.end) return false;
    return true;
  });

  const totalRevenue = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payments & Billing</h1>
        <p className="text-gray-600">View payment history and manage revenue</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Paid Appointments</div>
            <div className="text-2xl font-semibold text-gray-900">
              {filteredPayments.filter((p) => p.status === "paid").length}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
            <div className="text-2xl font-semibold text-gray-900">
              {filteredPayments.filter((p) => p.status === "unpaid").length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Date</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <Input
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <Input
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
            />
          </div>
          <Button
            onClick={() => setDateFilter({ start: "", end: "" })}
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No payments found for the selected date range
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {formatDate(payment.date)}
                  </TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.service}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {payment.paymentMethod ? (
                      <span className="capitalize">{payment.paymentMethod}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

