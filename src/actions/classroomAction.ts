'use server'

import { verifySession } from "@/lib/session";
import { ICreateClassroom, ICreateResource } from "@/types/classroomType";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";

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
export const getResources = async () => resources;




export async function createClassroom(classroom: ICreateClassroom) {
  console.log("-->createClassroom", classroom);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.post(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/resources/rooms`,
      { ...classroom },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("-->createClassroom.result", response.data);

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->createClassroom.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function updateClassroom(classroom: ICreateClassroom, resource_code: string) {
  console.log("-->updateClassroom", classroom);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.put(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/resources/${resource_code}`,
      { ...classroom },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("-->updateClassroom.result", response.data);

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->updateClassroom.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


export async function getClassroomList() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/resources/rooms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->getClassroomList.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


export async function deleteClassroom(resource_code: string) {
  console.log("-->deleteClassroom", resource_code);
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.delete(
      `${process.env.TIMETABLE_WORKER_ENDPOINT}/api/resources/${resource_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("-->deleteClassroom.result", response.data);

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->deleteClassroom.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}
