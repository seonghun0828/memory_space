import React, { useEffect } from 'react';
import { Functions } from '../body/Functions';
import axios from 'axios';

const addImg = (img, search, cateory) => {
  let data = JSON.parse(localStorage.getItem(cateory));
  if (!data) data = [];
  removeBackground();
  if (cateory === 'book') Functions().addBook(img, data, '');
  if (cateory === 'movie') Functions().addMovie(img, data, '');
  search.value = '';
};

const removeBackground = () => {
  const background = document.querySelector('.background');
  if (background) background.parentNode.removeChild(background);
};

const getApi = async (searchText) => {
  removeBackground();
  let apiData;
  if (
    searchText.value === '' ||
    searchText.value.replace(/^\s+|\s+$/g, '') === ''
  )
    return;
  const category = document.querySelector('.content-space').children[0];
  if (category.classList.contains('book-space')) {
    const key = '45fe65b5c3fbd3d400ad5daa0f415552';
    const {
      data: { documents },
    } = await axios.get('https://dapi.kakao.com/v3/search/book', {
      params: {
        query: searchText.value,
        size: 10,
      },
      headers: {
        Authorization: 'KakaoAK ' + key,
      },
    });
    apiData = documents;
  } else {
    const {
      data: { items },
    } = await axios.get('https://memory-space.herokuapp.com/api/data', {
      params: { query: searchText.value },
    });
    apiData = items;
    if (!apiData) return;
  }

  const content = document.querySelector('.content-space').children[0];
  const background = document.createElement('div');
  const blurImg = document.createElement('img');
  background.appendChild(blurImg);
  background.classList.add('background');
  blurImg.classList.add('blur-img');
  content.insertBefore(background, content.firstChild);

  if (category.classList.contains('book-space')) {
    apiData.forEach((ele) => {
      const div = document.createElement('div');
      div.classList.add('preview');
      const img = document.createElement('img');
      const text = document.createElement('span');
      div.appendChild(img);
      div.appendChild(text);
      img.src = ele.thumbnail;
      img.addEventListener('click', () =>
        addImg(ele.thumbnail, searchText, 'book')
      );
      text.innerText = ele.title;
      background.appendChild(div);
    });
  } else {
    apiData.forEach((ele) => {
      const poster = ele.image;
      const title = ele.title.replace(/<b>|<\/b>/g, '');
      if (poster === '') return;
      const div = document.createElement('div');
      div.classList.add('preview');
      const img = document.createElement('img');
      const text = document.createElement('span');
      div.appendChild(img);
      div.appendChild(text);
      img.src = poster;
      img.addEventListener('click', () => addImg(poster, searchText, 'movie'));
      text.innerText = title;
      background.appendChild(div);
    });
  }
};

export const SearchText = () => {
  useEffect(() => {
    const searchText = document.querySelector('.search-text');
    const searchIcon = document.querySelector('.search-icon');
    searchText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') getApi(searchText);
    });
    searchIcon.addEventListener('click', () => getApi(searchText));
    return () => {
      searchText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getApi(searchText);
      });
      searchIcon.removeEventListener('click', () => getApi(searchText));
    };
  });
  return (
    <>
      <input type="text" className="search-text"></input>
      <button className="nav-icon search-icon">🔍</button>
    </>
  );
};
