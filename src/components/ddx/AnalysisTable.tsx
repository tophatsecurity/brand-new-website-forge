
import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';

const AnalysisTable = () => {
  const tableData = [
    {
      hardware: "Image – AI Analysis",
      firmware: "Inspection and Analysis of imbedded Compromise",
      software: "Inspection and Analysis of Compromised Code",
      rf: "RF Forensics and Rogue detection",
      supplier: "90,000+ Component Based Suppliers"
    },
    {
      hardware: "ML Models to identify bad boards",
      firmware: "Decompile and identify, good and bad.",
      software: "Time-Machine to accelerate for future threats",
      rf: "Real-time record detection",
      supplier: "Risk Rating for each area on the component system."
    },
    {
      hardware: "ML Models to Identify Chips",
      firmware: "Identify Rogue Firmware Calls",
      software: "Identify Bad Commands and Bad IP's",
      rf: "Sensor Based Collection Device",
      supplier: "600+ Correlated Threat Feeds Verifying New Threats"
    },
    {
      hardware: "Testing and Certification of Equipment",
      firmware: "Test and Approve and Certify",
      software: "Certify and approve SBOM",
      rf: "Integrate with ISR Solutions",
      supplier: "Rank and Prepare your Suppliers and Sub Suppliers"
    }
  ];

  const columns = [
    { title: "Hardware – AI Analysis", key: "hardware" },
    { title: "Firmware - Inspection", key: "firmware" },
    { title: "Software BOM – Decompile Inspection", key: "software" },
    { title: "RF – Analysis, Inspection and Rogue Protection", key: "rf" },
    { title: "Trusted Supplier Database & Threat Feeds", key: "supplier" }
  ];

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Analysis Capabilities</h2>
      
      <div className="overflow-x-auto">
        <Table className="border border-border">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="bg-muted font-bold text-foreground">
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell 
                    key={`${rowIndex}-${column.key}`}
                    className="border border-border"
                  >
                    {row[column.key as keyof typeof row]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnalysisTable;
