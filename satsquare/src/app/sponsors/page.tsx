// // export default function Sponsors() {

// //   const sponsors = [
// //     {
// //       id: 1,
// //       nom: "Coca Cola",
// //       valide: 1,
// //       adresse_eclairage: "Adresse 1",
// //       est_confirme: true,
// //       cree_le: new Date("2024-05-01T10:00:00Z"),
// //       mis_a_jour_le: new Date("2024-05-15T10:00:00Z"),
// //       Utilisateurs: [],
// //       Dons: []
// //     },
// //     {
// //       id: 2,
// //       nom: "Burger King",
// //       valide: 0,
// //       adresse_eclairage: "Adresse 2",
// //       est_confirme: false,
// //       cree_le: new Date("2024-05-02T11:00:00Z"),
// //       mis_a_jour_le: new Date("2024-05-16T11:00:00Z"),
// //       Utilisateurs: [],
// //       Dons: []
// //     },
// //     {
// //       id: 3,
// //       nom: "Nike",
// //       valide: 1,
// //       adresse_eclairage: "Adresse 3",
// //       est_confirme: true,
// //       cree_le: new Date("2024-05-03T12:00:00Z"),
// //       mis_a_jour_le: new Date("2024-05-17T12:00:00Z"),
// //       Utilisateurs: [],
// //       Dons: []
// //     }
// //   ];

// //   return (
// //     <div className="h-screen bg-[#F3F3FF] p-4">
// //       <div className="bg-white rounded-lg p-4 shadow-md">
// //         <div className="flex justify-between items-center mb-4">
// //           <div className="flex items-center space-x-2">
// //             <div className="bg-[#F8D99B] p-2 rounded-md flex items-center">
// //               <span role="img" aria-label="icon">👥</span>
// //               <span className="ml-2">Sponsors</span>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="flex items-center space-x-2 mb-4">
// //           <button className="bg-[#F8D99B] text-white py-2 px-4 rounded-md">Ajouter un nouveau</button>
// //           <input type="text" placeholder="Chercher un élément ..." className="border p-2 rounded-md flex-grow bg-[#EEEEEF]" />
// //           <button className="bg-[#F8D99B] p-2 rounded-md">🔍</button>
// //           <button className="bg-[#F8D99B] p-2 rounded-md">Filtres</button>
// //         </div>
// //         <div className="bg-[#F3F3FF] p-4 rounded-lg">
// //           <table className="min-w-full bg-white border">
// //             <thead>
// //               <tr className="bg-[#EDF2FF]">
// //                 <th className="border px-4 py-2">Nom</th>
// //                 <th className="border px-4 py-2">Adresse</th>
// //                 <th className="border px-4 py-2">Valide</th>
// //                 <th className="border px-4 py-2">Confirmé</th>
// //                 <th className="border px-4 py-2">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {sponsors.map((sponsor) => (
// //                 <tr key={sponsor.id}>
// //                   <td className="border px-4 py-2">{sponsor.nom}</td>
// //                   <td className="border px-4 py-2">{sponsor.adresse_eclairage}</td>
// //                   <td className="border px-4 py-2">
// //                     {sponsor.valide ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
// //                   </td>
// //                   <td className="border px-4 py-2">
// //                     {sponsor.est_confirme ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
// //                   </td>
// //                   <td className="border px-4 py-2 space-x-2">
// //                     <button className="bg-[#F8D99B] p-2 rounded-md">✏️</button>
// //                     <button className="bg-red-400 p-2 rounded-md">🗑️</button>
// //                     <button className="bg-green-400 p-2 rounded-md">👁️</button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // src/app/sponsors/page.tsx
// import { FC } from 'react';
// import prisma from '@/utils/db';
// import { Sponsor } from '@prisma/client';

// const getSponsors = async (): Promise<Sponsor[]> => {
//   return await prisma.sponsor.findMany();
// };

// const SponsorsPage: FC = async () => {
//   const sponsors = await getSponsors();

//   return (
//     <div className="h-screen bg-[#F3F3FF] p-4">
//       <div className="bg-white rounded-lg p-4 shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center space-x-2">
//             <div className="bg-[#F8D99B] p-2 rounded-md flex items-center">
//               <span role="img" aria-label="icon">👥</span>
//               <span className="ml-2">Sponsors</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-2 mb-4">
//           <button className="bg-[#F8D99B] text-white py-2 px-4 rounded-md">Ajouter un nouveau</button>
//           <input type="text" placeholder="Chercher un élément ..." className="border p-2 rounded-md flex-grow bg-[#EEEEEF]" />
//           <button className="bg-[#F8D99B] p-2 rounded-md">🔍</button>
//           <button className="bg-[#F8D99B] p-2 rounded-md">Filtres</button>
//         </div>
//         <div className="bg-[#F3F3FF] p-4 rounded-lg">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-[#EDF2FF]">
//                 <th className="border px-4 py-2">Nom</th>
//                 <th className="border px-4 py-2">Adresse</th>
//                 <th className="border px-4 py-2">Valide</th>
//                 <th className="border px-4 py-2">Confirmé</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sponsors.map((sponsor) => (
//                 <tr key={sponsor.id}>
//                   <td className="border px-4 py-2">{sponsor.nom}</td>
//                   <td className="border px-4 py-2">{sponsor.adresse_eclairage}</td>
//                   <td className="border px-4 py-2">
//                     {sponsor.valide ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
//                   </td>
//                   <td className="border px-4 py-2">
//                     {sponsor.est_confirme ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
//                   </td>
//                   <td className="border px-4 py-2 space-x-2">
//                     <button className="bg-[#F8D99B] p-2 rounded-md">✏️</button>
//                     <button className="bg-red-400 p-2 rounded-md">🗑️</button>
//                     <button className="bg-green-400 p-2 rounded-md">👁️</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SponsorsPage;


import { FC } from 'react';
import prisma from '@/utils/db';
import { Sponsor } from '@prisma/client';
import SponsorTable from '../components/Sponsor/SponsorTable';
import SponsorSearchBar from '../components/Sponsor/SponsorSearchBar';
import SponsorHeader from '../components/Sponsor/SponsorHeader';

const getSponsors = async (): Promise<Sponsor[]> => {
  return await prisma.sponsor.findMany();
};

const SponsorsPage: FC = async () => {
  const sponsors = await getSponsors();

  return (
    <div className="h-screen bg-[#F3F3FF] p-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <SponsorHeader />
        <SponsorSearchBar />
        <SponsorTable sponsors={sponsors} />
      </div>
    </div>
  );
};

export default SponsorsPage;
