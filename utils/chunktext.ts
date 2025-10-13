export function chunktext (text: string, chunkSize: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    for(let i = 0; i < words.length; i+= chunkSize){
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
    }
    return chunks;
}