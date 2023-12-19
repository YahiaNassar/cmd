// src/App.js
import React, { useState, useEffect } from 'react';
import { Layout, Input, List, Card, Button, Modal, Form, Input as AntInput, Select } from 'antd';
import movieData from './db.json'; // Update the path accordingly

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;



const App = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    // Fetch data directly from imported JSON file
    const fetchedMovies = movieData.movies;
    setAllMovies(fetchedMovies);
    setFilteredMovies(fetchedMovies);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    filterMovies(value);
  };

  const filterMovies = (search) => {
    if(search){
      const filtered = filteredMovies.filter(
          (movie) =>
              movie.title.toLowerCase().includes(search.toLowerCase()) ||
              movie.genres.some((genre) => genre.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredMovies(filtered);
    }else{
      setFilteredMovies(allMovies);
    }

  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setEditModalVisible(true);
    editForm.setFieldsValue({
      title: movie.title,
      description: movie.plot,
      imageLink: movie.posterUrl,
      genres: movie.genres,
    });
  };

  const handleEditModalOk = () => {
    // Update the movie in the state
    const updatedMovies = allMovies.map((movie) =>
      movie.id === selectedMovie.id
        ? {
            ...movie,
            plot: editForm.getFieldValue('description'),
            posterUrl: editForm.getFieldValue('imageLink'),
            genres: editForm.getFieldValue('genres'),
          }
        : movie
    );

    setAllMovies(updatedMovies);
    setFilteredMovies(updatedMovies.filter((movie) => movie.title.toLowerCase().includes(searchText.toLowerCase())));
    setEditModalVisible(false);
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
  };

  const handleFilterModalOk = () => {
    // Apply filters to the movies
    const filters = filterForm.getFieldsValue();
    const filtered = allMovies.filter((movie) => {
      return (
        (!filters.genres || filters.genres.every((genre) => movie.genres.includes(genre))) &&
        (!filters.actors || movie.actors.toLowerCase().includes(filters.actors.toLowerCase())) &&
        (!filters.year || movie.year === filters.year) &&
        (!filters.runtime || movie.runtime === filters.runtime) &&
        (!filters.director || movie.director.toLowerCase().includes(filters.director.toLowerCase()))
      );
    });

    setFilteredMovies(filtered);
    setFilterModalVisible(false);
  };

  const handleFilterModalCancel = () => {
    setFilterModalVisible(false);
  };

  const renderEditButton = (movie) => (
    <Button type="primary" onClick={() => handleEdit(movie)}>
      Edit
    </Button>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} style={{ background: '#fff' }}>
        <Search
          placeholder="Search by title or genre"
          onSearch={handleSearch}
          style={{ margin: '16px' }}
        />
        <Button type="primary" onClick={() => setFilterModalVisible(true)} style={{ margin: '16px' }}>
          Filter
        </Button>
        {(searchText || filterForm.isFieldsTouched()) && (
          <List
            dataSource={filteredMovies}
            renderItem={(movie) => (
              <List.Item>
                <Card title={movie.title} style={{ width: '100%' }}>
                  <p>Year: {movie.year}</p>
                  <p>Runtime: {movie.runtime} minutes</p>
                  <p>Genres: {movie.genres.join(', ')}</p>
                  <p>Director: {movie.director}</p>
                  <p>Actors: {movie.actors}</p>
                  <p>Plot: {movie.plot}</p>
                  <img src={movie.posterUrl} alt={movie.title} style={{ maxWidth: '100%' }} />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          <h1>All Movies</h1>
          <List
            dataSource={filteredMovies}
            renderItem={(movie) => (
              <List.Item>
                <Card title={movie.title} style={{ width: '100%' }}>
                  <p>Year: {movie.year}</p>
                  <p>Runtime: {movie.runtime} minutes</p>
                  <p>Genres: {movie.genres.join(', ')}</p>
                  <p>Director: {movie.director}</p>
                  <p>Actors: {movie.actors}</p>
                  <p>Plot: {movie.plot}</p>
                  <img src={movie.posterUrl} alt={movie.title} style={{ maxWidth: '100%' }} />
                  {renderEditButton(movie)}
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
      {/* Edit Movie Modal */}
      <Modal
        title="Edit Movie"
        visible={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        <Form form={editForm} initialValues={{ genres: selectedMovie?.genres }}>
          <Form.Item label="Title">
            <AntInput value={selectedMovie?.title} disabled />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <AntInput.TextArea />
          </Form.Item>
          <Form.Item label="Image Link" name="imageLink">
            <AntInput />
          </Form.Item>
          <Form.Item label="Genres" name="genres">
            <Select mode="tags" placeholder="Select genres">
              {movieData.genres.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Filter Movie Modal */}
      <Modal
        title="Filter Movies"
        visible={filterModalVisible}
        onOk={handleFilterModalOk}
        onCancel={handleFilterModalCancel}
      >
        <Form form={filterForm}>
          <Form.Item label="Genres" name="genres">
            <Select mode="multiple" placeholder="Select genres">
              {movieData.genres.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Actors" name="actors">
            <AntInput />
          </Form.Item>
          <Form.Item label="Year" name="year">
            <AntInput type="number" />
          </Form.Item>
          <Form.Item label="Runtime" name="runtime">
            <AntInput type="number" />
          </Form.Item>
          <Form.Item label="Director" name="director">
            <AntInput />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;