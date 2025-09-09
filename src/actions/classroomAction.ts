import { ICreateResource } from "@/types/classroomType";

let resources: ICreateResource[] = [];

// Add a resource
export const addResource = async (newResource: ICreateResource) => {
  resources.push(newResource);
  return resources;
};

// Update a resource
export const updateResource = async (updatedResource: ICreateResource) => {
  resources = resources.map(r => r.name === updatedResource.name ? updatedResource : r);
  return resources;
};

// Delete a resource
export const deleteResource = async (resourceToDelete: ICreateResource) => {
  resources = resources.filter(r => r.name !== resourceToDelete.name);
  return resources;
};

// Get all resources
export const getResources = () => resources;
