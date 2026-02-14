/**
 * API client to communicate with FastAPI backend
 */

import type { Game, ApiResponse } from './types';

const API_BASE_URL = "https://studious-train-r49xxjxggxpgf5jwq-8000.app.github.dev";

/**
 * Test the connection to the backend
 */
export async function healthCheck(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Health check failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Fetch chaos module data from backend
 */
export async function fetchChaosData(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch chaos data:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Test chaos module with provided data
 */
export async function testChaos(testData: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chaos/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Chaos test failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Fetch game data with chaos scores from backend
 */
export async function fetchChaosGames(): Promise<ApiResponse<Game[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/chaos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch chaos games:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
