'use server'
import { actionErrorHandler } from "@/actions/errorManagement";
import { IConfig } from "@/types/utilitiesTypes";
import axios from "axios";

export async function getConfig() {
  try {
    const baseUrl = process.env.CURRICULUM_WORKER_ENDPOINT;

    const endpoints = {
      educationLevels: `${baseUrl}/api/utilities/education-levels`,
      relationships: `${baseUrl}/api/utilities/relationship-types`,
      ethnicities: `${baseUrl}/api/utilities/ethnicities`,
      regions: `${baseUrl}/api/utilities/regions`,
      departments: `${baseUrl}/api/utilities/departments`,
      arrondissements: `${baseUrl}/api/utilities/arrondissements`
    };
    
    const [
      educationLevelsRes,
      relationshipsRes,
      ethnicitiesRes,
      regionsRes,
      departmentsRes,
      arrondissementsRes
    ] = await Promise.all([
      axios.get(endpoints.educationLevels),
      axios.get(endpoints.relationships),
      axios.get(endpoints.ethnicities),
      axios.get(endpoints.regions),
      axios.get(endpoints.departments),
      axios.get(endpoints.arrondissements)
    ]);
    
    return {
      code: "success",
      error: null,
      data: {
        educationLevels: educationLevelsRes.data.body,
        relationships: relationshipsRes.data.body,
        ethnicities: ethnicitiesRes.data.body,
        regions: regionsRes.data.body,
        departments: departmentsRes.data.body,
        arrondissements: arrondissementsRes.data.body
      } as IConfig
    };

  } catch (error: unknown) {
    console.log("-->utilitiesActions.getConfig.error");
    return actionErrorHandler(error);
  }
}

export async function getCurriculumListSite(){
    try {
      const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/curriculums`,{
          headers: {
            "X-API-Key": process.env.X_API,
          },
      });
      console.log('-->result', response.data);
      
      return {
          code: 'success',
          error: null,
          data: response.data
      }
    } catch (error: unknown) {
        console.log('-->createCurriculum.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}
