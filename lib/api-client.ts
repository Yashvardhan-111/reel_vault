import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;    //Omit<T, K> removes the _id property

type FetchOptions = {                               //type in TypeScript is used to define a custom type — basically a blueprint that describes the structure of an object or variable.
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
};

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return response.json();
    }

    async getVideos() {
        return this.fetch("/videos");
    }

    async createVideo(videoData: VideoFormData) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData,
        });
    }
}

export const apiClient = new ApiClient();
