import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;






// import React from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
// import { Star } from 'lucide-react'


// interface StatCardProps {
//     title: string;
//     value: string | number;
//     description: string;
// }
// const StatCard = ({description, title, value}: StatCardProps) => {
//   return (
//     <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">
//             {title}
//           </CardTitle>
//           <Star className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{value}</div>
//           <p className="text-xs text-muted-foreground">
//             {description}
//           </p>
//         </CardContent>
//       </Card>
//   )
// }




// export default StatCard