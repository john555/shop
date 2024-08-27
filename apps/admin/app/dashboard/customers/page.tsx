import * as React from "react";
import { Customers } from "@admin/features/customers-table";

export default function CustomersPage() {
  return (
    <div className="container mx-auto">
      <h3 className="text-xl text-slate-500 pb-4">Customers</h3>
      <Customers />
    </div>
  );
}
