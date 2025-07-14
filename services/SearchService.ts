import axiosClient from "@/utils/axiosClient";

// Types for search functionality
export interface SearchParams {
  query: string;
  type?: 'all' | 'products' | 'categories' | 'tags' | 'countries' | 'admins' | 'print_templates';
  types?: string[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categoryId?: number;
  countryId?: number;
  tagId?: number;
  adminLevel?: string;
  status?: string;
}

export interface SearchResult {
  type: string;
  id: number;
  title: string;
  description: string;
  image?: string;
  url: string;
  score: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  query: string;
  filters: Record<string, any>;
  executionTime?: number;
}

export interface SearchStats {
  total: number;
  byType: Record<string, number>;
  query: string;
  executionTime: number;
}

export interface QuickSearchResult {
  products: SearchResult[];
  categories: SearchResult[];
  tags: SearchResult[];
  countries: SearchResult[];
  admins: SearchResult[];
  print_templates: SearchResult[];
}

// Main search function
export const search = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Required parameters
    queryParams.append('query', params.query);
    
    // Optional parameters
    if (params.type && params.type !== 'all') {
      queryParams.append('type', params.type);
    }
    if (params.types && params.types.length > 0) {
      queryParams.append('types', params.types.join(','));
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    if (params.categoryId) {
      queryParams.append('categoryId', params.categoryId.toString());
    }
    if (params.countryId) {
      queryParams.append('countryId', params.countryId.toString());
    }
    if (params.tagId) {
      queryParams.append('tagId', params.tagId.toString());
    }
    if (params.adminLevel) {
      queryParams.append('adminLevel', params.adminLevel);
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }

    const response = await axiosClient.get(`search?${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Search error:', error);
    return {
      results: [],
      total: 0,
      limit: 10,
      offset: 0,
      hasMore: false,
      query: params.query,
      filters: {}
    };
  }
};

// Get search statistics
export const getSearchStats = async (query: string): Promise<SearchStats> => {
  try {
    const response = await axiosClient.get(`search/stats?query=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Search stats error:', error);
    return {
      total: 0,
      byType: {},
      query,
      executionTime: 0
    };
  }
};

// Get search suggestions
export const getSearchSuggestions = async (query: string, limit: number = 5): Promise<string[]> => {
  try {
    if (query.length < 2) return [];
    
    const response = await axiosClient.get(`search/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Search suggestions error:', error);
    return [];
  }
};

// Quick search
export const quickSearch = async (query: string): Promise<QuickSearchResult> => {
  try {
    if (query.length < 2) {
      return {
        products: [],
        categories: [],
        tags: [],
        countries: [],
        admins: [],
        print_templates: []
      };
    }
    
    const response = await axiosClient.get(`search/quick?query=${encodeURIComponent(query)}`);
    return response.data.data;
  } catch (error) {
    console.error('Quick search error:', error);
    return {
      products: [],
      categories: [],
      tags: [],
      countries: [],
      admins: [],
      print_templates: []
    };
  }
}; 