import { type AxiosInstance } from "axios";
import type { PaginatedResponse, SelectOption } from "../types/index";
import { apiClient } from "../../lib/axios";
export interface BaseServiceConfig<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  endpoint: string;
  axios?: AxiosInstance;
  getAll?: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getById?: (id: string | number) => Promise<TEntity>;
  create?: (data: TCreateDto) => Promise<TEntity>;
  update?: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove?: (id: string | number) => Promise<void>;
  getSelectOptions?: () => Promise<SelectOption[]>;
}

export interface BaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  getAll: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getById: (id: string | number) => Promise<TEntity>;
  create: (data: TCreateDto) => Promise<TEntity>;
  update: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove: (id: string | number) => Promise<void>;
  getSelectOptions: () => Promise<SelectOption[]>;
}

export function createBaseService<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilterParams = Record<string, unknown>,
>(
  config: BaseServiceConfig<TEntity, TCreateDto, TUpdateDto, TFilterParams>,
): BaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  const axios = config.axios ?? apiClient;
  const endpoint = config.endpoint;

  return {
    getAll:
      config.getAll ??
      (async (params?: TFilterParams) => {
        return axios.get<PaginatedResponse<TEntity>>(endpoint, {
          params,
        }) as unknown as Promise<PaginatedResponse<TEntity>>;
      }),
    getById:
      config.getById ??
      (async (id: string | number) => {
        return axios.get<TEntity>(`${endpoint}/${id}`) as unknown as Promise<TEntity>;
      }),
    create:
      config.create ??
      (async (data: TCreateDto) => {
        return axios.post<TEntity>(endpoint, data) as unknown as Promise<TEntity>;
      }),
    update:
      config.update ??
      (async (id: string | number, data: TUpdateDto) => {
        return axios.put<TEntity>(`${endpoint}/${id}`, data) as unknown as Promise<TEntity>;
      }),
    remove:
      config.remove ??
      (async (id: string | number) => {
        return axios.delete(`${endpoint}/${id}`) as unknown as Promise<void>;
      }),
    getSelectOptions:
      config.getSelectOptions ??
      (async () => {
        return axios.get<SelectOption[]>(`${endpoint}/select-options`) as unknown as Promise<SelectOption[]>;
      }),
  };
}
