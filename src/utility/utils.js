// import data from "../data/projects.json" assert { type: "json" };
// import fs from 'fs/promises';
// import path from 'path';

export function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function convertToEmbedLink(url) {
  if (!url) return url;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  return url; // Return original if not a YouTube URL
}

// const newData = {projects: []}
// for (const project of data.projects) {
//   const projectIndex = data.projects.indexOf(project);
  
//   // Convert trailer URL if it exists
//   if (project.trailer) {
//     data.projects[projectIndex].trailer = convertToEmbedLink(project.trailer);
//   }
  
//   // Process types
//   for (let type of project.type) {
//     const addSpace = type.replace(/_/g, " ");
//     const newType = capitalizeEachWord(addSpace);
//     const typeIndex = data.projects[projectIndex].type.indexOf(type);
//     data.projects[projectIndex].type[typeIndex] = newType;
//   }

//   for (let tag of project.tags) {
//     const addSpace = tag.replace(/_/g, " ");
//     const newTag = capitalizeEachWord(addSpace);
//     const tagIndex = data.projects[projectIndex].tags.indexOf(tag);
//     data.projects[projectIndex].tags[tagIndex] = newTag;
//   }
//   newData.projects.push(data.projects[projectIndex]);
// }

// // Write the updated data back to the file
// const outputPath = path.join(process.cwd(), 'src/data/projects.jsonNew');
// try {
//   await fs.writeFile(outputPath, JSON.stringify(newData, null, 2), 'utf8');
//   console.log('Successfully wrote updated data to projects.json');
// } catch (error) {
//   console.error('Error writing file:', error);
// }
