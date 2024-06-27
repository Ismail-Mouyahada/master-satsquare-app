import { Table } from "flowbite-react";

export function DataTable({ columns, data }: { columns: any[], data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          {columns.map((col) => (
            <Table.HeadCell key={col.accessor}>{col.header}</Table.HeadCell>
          ))}
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((row, rowIndex) => (
            <Table.Row
              key={rowIndex}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {columns.map((col) => (
                <Table.Cell
                  key={col.accessor}
                  className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                >
                  {row[col.accessor]}
                </Table.Cell>
              ))}
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}


// Exemple d'usage
// const columns = [
//     { header: "Product name", accessor: "productName" },
//     { header: "Color", accessor: "color" },
//     { header: "Category", accessor: "category" },
//     { header: "Price", accessor: "price" },
//   ];
  
//   const data = [
//     {
//       productName: 'Apple MacBook Pro 17"',
//       color: "Silver",
//       category: "Laptop",
//       price: "$2999",
//     },
//     {
//       productName: "Microsoft Surface Pro",
//       color: "White",
//       category: "Laptop PC",
//       price: "$1999",
//     },
//     {
//       productName: "Magic Mouse 2",
//       color: "Black",
//       category: "Accessories",
//       price: "$99",
//     },
//   ];
  
//   export function Component() {
//     return <DataTable columns={columns} data={data} />;
//   }