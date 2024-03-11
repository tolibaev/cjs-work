#!/usr/bin/env node
import axios from 'axios';

import fs from 'fs';

const url = 'https://fa3ed49664b21694.mokky.dev/classes';

axios
  .get(url)
  .then(response => {
    const arrayFromApi = Object.values(response.data[0]);

    const filename = 'cjsWork.css';
    const filePath = `./${filename}`;

    let cssContent = '';

    arrayFromApi.forEach(className => {
      cssContent += `${className}\n`;
    });

    fs.writeFile(filePath, cssContent, err => {
      if (err) {
        console.error('Ошибка при записи файла:', err);
      } else {
        console.log(`Файл ${filename} успешно создан и записан!`);

        // Удаление содержимого из API
      }
    });
  })
  .catch(error => {
    console.log(error);
  });

axios
  .delete(`${url}/1`)
  .then(() => {
    console.log('Содержимое API успешно удалено!');
  })
  .catch(error => {
    console.error('Ошибка при удалении содержимого из API:', error);
  });
