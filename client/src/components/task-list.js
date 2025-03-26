import React, { useEffect , useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTaskByUserId , deleteTask} from "../redux/slices/task-slice";
import { useNavigate } from "react-router-dom";
import { Table , Button , Input } from "antd";
import dayjs from "dayjs";
import '../styles/app.css';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, error, loading } = useSelector((state) => state.task);
  const navigate = useNavigate();
  const [ searchQuery , setSearchQuery ] = useState("");

  useEffect(() => {
    dispatch(getTaskByUserId());
    
  }, [dispatch]);
  
  console.log(tasks); 
  const handleDelete = async (taskId) => {
   await dispatch(deleteTask(taskId));
   dispatch(getTaskByUserId()); 
  };
  const handleEdit = (taskId) => {
    navigate(`/update-task/${taskId}`);
  };



  const filteredTasks = tasks && tasks.tasks ? tasks.tasks.filter((task) => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  
  task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ): [];

  const columns = [
    { title : 'Title' , dataIndex : 'title' , key : 'title' },
    { title : 'Description' , dataIndex : 'description' , key : 'description' },
    { title : 'Due Date' , dataIndex : 'dueDate' , key : 'dueDate' , render: (dueDate) => dayjs(dueDate).format("DD/MM/YYYY") },
    { title : 'Is Completed' , dataIndex : 'completed' , key : 'completed' , render: (completed) => (completed ? "Completed" : "Pending")},
    { title : 'Tags' , dataIndex : 'tags' , key : 'tags' ,  render: (tags) => {
      try {
        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
        return parsedTags.join(", ");
      } catch (error) {
        return tags.join(", ");
      }
    }},
    { title : 'Photo' , dataIndex : 'photos' , key : 'photos' , render: (photos) => {
      if (!photos || photos.length === 0) return <span>No Photos</span>;
      return (
        <div style={{ display: "flex", gap: "5px" }}>
          {photos.map((photo, index) => {
            console.log(photo);
            return (
              <img 
                key={index} 
                src={`http://localhost:5000/${photo}`}
                alt={`photo-${index}`} 
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} 
              />
            );
          })}
        </div>
      );
    }},
    { title : 'Files' , dataIndex : 'files' , key : 'files' ,render: (files) => (
      files && files.length > 0 ? (
        files.map((file, index) => (
          <a key={index} href={`http://localhost:5000/${file}`} download>
            {file}
          </a>
        ))
      ) : null
    ) },
    {
      title: 'Actions',
      key: 'actions',
      render: (_ , record) => (
        <>
          <Button onClick={() => handleEdit(record._id)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
    
  ];
  return(
    <div className="container">
      <Button onClick={() => navigate("/create-task")} type="primary">Create Task</Button>
      <Input
        placeholder="Search tasks"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: "20px 0" }}
      />
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <Table
        columns={columns}
        scroll={{ x: "max-content" }}
         size="small"
         pagination={{
          pageSize: 10, 
          showSizeChanger: false, 
        }}
        dataSource={filteredTasks}
        rowKey="_id"
        expandable={{
          expandedRowRender: (record) => (
            <div className="expanded-row-content">
              Hint: {record.recommendation}
            </div>
          
          ),
          rowExpandable: (record) => record.title !== 'Not Expandable', // Eğer istenen şartı sağlıyorsa
        }}
      />
    </div>
  )
};

export default TaskList;
