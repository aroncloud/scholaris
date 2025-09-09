import { useState } from "react";
import { ICreateResource } from "@/types/classroomType";
import * as ClassroomAction from "@/actions/classroomAction";

export const useClassroomData = () => {
  const [resources, setResources] = useState<ICreateResource[]>(ClassroomAction.getResources());

  const addResource = async (newResource: ICreateResource) => {
    const updated = await ClassroomAction.addResource(newResource);
    setResources([...updated]);
  };

  const updateResource = async (updatedResource: ICreateResource) => {
    const updated = await ClassroomAction.updateResource(updatedResource);
    setResources([...updated]);
  };

  const deleteResource = async (resourceToDelete: ICreateResource) => {
    const updated = await ClassroomAction.deleteResource(resourceToDelete);
    setResources([...updated]);
  };

  return { 
    resources, 
    addResource, 
    updateResource, 
    deleteResource };
};




// import { useState } from "react";
// import { ICreateResource } from "@/types/classroomType";

// export const useClassroomData = () => {
//   const [resources, setResources] = useState<ICreateResource[]>([]);

//   const addResource = async (newResource: ICreateResource) => {
//   setResources(prev => [...prev, newResource]);
// };


//   const updateResource = async (updatedResource: ICreateResource) => {
//     setResources(resources.map(r =>
//       r.name === updatedResource.name ? updatedResource : r
//     ));
//   };

//   const deleteResource = async (resourceToDelete: ICreateResource) => {
//   setResources(prev => prev.filter(r => r.name !== resourceToDelete.name));
// };


//   return { 
//     resources, 
//     addResource, 
//     updateResource, 
//     deleteResource };
// };
