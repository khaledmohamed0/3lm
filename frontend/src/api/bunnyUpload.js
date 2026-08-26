import * as tus from "tus-js-client";


const BUNNY_TUS_ENDPOINT =
    "https://video.bunnycdn.com/tusupload";


export const uploadVideoToBunny = ({
    file,
    uploadData,
    onProgress,
}) => {

    return new Promise((resolve, reject) => {

        const upload = new tus.Upload(
            file,
            {
                endpoint: BUNNY_TUS_ENDPOINT,

                retryDelays: [
                    0,
                    3000,
                    5000,
                    10000,
                    20000,
                ],

                headers: {
                    AuthorizationSignature:
                        uploadData.authorizationSignature,

                    AuthorizationExpire:
                        uploadData.authorizationExpire,

                    VideoId:
                        uploadData.videoId,

                    LibraryId:
                        uploadData.libraryId,
                },

                metadata: {
                    filetype: file.type,
                    title: file.name,
                },

                onError: (error) => {
                    reject(error);
                },

                onProgress: (
                    bytesUploaded,
                    bytesTotal
                ) => {

                    const percentage =
                        Math.round(
                            (bytesUploaded /
                                bytesTotal) *
                            100
                        );

                    if (onProgress) {
                        onProgress(percentage);
                    }
                },

                onSuccess: () => {

                    resolve({
                        videoId:
                            uploadData.videoId,
                    });

                },
            }
        );


        upload.start();

    });

};