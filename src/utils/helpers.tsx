const hashtagContent = (content: string) => {
    return content.split(/(#[\w]+)/g).map((part, index) => {
        if (part.startsWith("#")) {
            return (
                <span key={index} className="text-primary">
                    {part}
                </span>
            );
        }

        return part;
    });
};

export const helperUtils = {
    hashtagContent,
};
