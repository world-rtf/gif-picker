import GIPHY_API_KEY from "@/TOKEN";

export const fetchGifs = async (word) => {
    // https://developers.giphy.com/dashboard/
    try {
        //https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
        const giff = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${word}&limit=8`, 
            {
                method: 'GET' // Указываем метод запроса
            }
        ); // получаем JSON файл
        const data = await giff.json();
        return data.data;
    } catch (error) {
        console.error("ERROR", error);
        return [];
    }
};
