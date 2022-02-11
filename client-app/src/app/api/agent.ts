import axios, { AxiosError, AxiosResponse } from 'axios';
import { history } from '../..';
import { toast } from 'react-toastify';
import { Activity, ActivityFormValues } from '../models/activity';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';
import { Photo, Profile, UserActivity } from '../models/profile';
import { PaginatedResult } from '../models/pagination';
import { SearchResult } from '../models/search';
import { ChannelDetailsDto, ChatDto, GroupDetailsDto, GroupMemberPermissions, Message, Pin, PrivateChat } from '../models/chat';

axios.defaults.baseURL = 'http://localhost:5000/api/';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    async (response) => {
        await sleep(1000);
        const pagination = response.headers['pagination'];
        if (pagination) {
            response.data = new PaginatedResult(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<any>>;
        }
        return response;
    },
    (error: AxiosError) => {
        const { data, status, config } = error.response!;
        switch (status) {
            case 400:
                if (typeof data === 'string') {
                    toast.error(data);
                }
                if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                    history.push('/not-found');
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                }
                break;
            case 401:
                toast.error('unauthorized');
                break;
            case 404:
                history.push('not-found');
                break;
            case 500:
                store.commonStore.setServerError(data);
                history.push('/server-error');
                break;
        }
        return Promise.reject(error);
    }
);

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params }).then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
};

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
};

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    updateProfile: (profile: Partial<Profile>) => requests.put('/profiles', profile),
    getActivities: (username: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
};

const Search = {
    search: (term: string) => requests.get<SearchResult[]>(`/search/${term}`)
};

const Chats = {
    createPrivateChat: (targetUsername: string) => requests.post<ChatDto>(`/direct/`, { targetUsername }),
    getPrivateChatDetails: (chatId: string) => requests.get<PrivateChat>(`/direct/privateChatDetails/${chatId}`),
    createMessage: (body: string, chatId: string, replyToMessageId: number) => requests.post<Message>('/direct/messages', { body, chatId, replyToMessageId }),
    createPhoto: (file: Blob, body: string, chatId: string, config: any, replyToMessageId: number) => {
        let formData = new FormData();
        formData.append('File', file);
        formData.append('File', file);
        formData.append('Body', body);
        formData.append('ChatId', chatId);
        formData.append('ReplyToMessageId', replyToMessageId.toString());
        return axios.post<Message>('/direct/photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' },
            ...config
        });
    },
    createVideo: (file: Blob, body: string, chatId: string, config: any, replyToMessageId: number) => {
        let formData = new FormData();
        formData.append('File', file);
        formData.append('Body', body);
        formData.append('ChatId', chatId);
        formData.append('ReplyToMessageId', replyToMessageId.toString());
        return axios.post<Message>('/direct/videos', formData, {
            headers: { 'Content-type': 'multipart/form-data' },
            ...config
        });
    },
    createChannel: (name: string, description: string) => requests.post<ChatDto>('/channel/', { name, description }),
    getChannelDetails: (id: string) => requests.get<ChannelDetailsDto>(`/channel/${id}`),
    addMembers: (id: string, members: string[]) => requests.post<boolean>('direct/addMember', { id, members }),
    createGroup: (name: string, members: string[]) => requests.post<ChatDto>('/group/', { name, members }),
    getGroupDetails: (id: string) => requests.get<GroupDetailsDto>(`/group/${id}`),
    updateSeen: (chatId: string, newLastSeen: Date) => requests.post<boolean>(`direct/updateSeen`, { chatId, newLastSeen }),
    removeMember: (chatId: string, username: string) => requests.post<boolean>(`direct/removeMember/`, { chatId, username }),
    updateMemberPermissions: (chatId: string, permissions: GroupMemberPermissions) => requests.post<boolean>(`group/updateMembersPermissions`, { chatId, ...permissions }),
    addPin: (chatId: string, messageId: number, isMutual: boolean) => requests.post<Pin>('direct/addPin', { chatId, messageId, isMutual }),
    removePin: (chatId: string, pinId: number) => requests.post<boolean>('direct/removePin', { chatId, pinId }),
    forwardMessages: (chatIds: string[], messageIds: number[], srcChatId: string, body: string, showSender: boolean) =>
        requests.post<boolean>('direct/forward', { chatIds, messageIds, srcChatId, body, showSender })
};

const agent = {
    Activities,
    Account,
    Profiles,
    Search,
    Chats
};

export default agent;
