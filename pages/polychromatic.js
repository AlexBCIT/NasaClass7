import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import styled from "styled-components";

import dynamic from "next/dynamic";


const TableText = styled.div`
display: none;
`;

const TableOuter = styled.div`
padding: 1rem;
margin: 1rem;
font-size: 1.5rem;
font-family: 'Poppins', sans-serif;
display: flex;
justify-content: space-between;
flex-direction: row;
`;

const ImageButton = styled.div`
display: flex;
justify-content: space-between;
flex-direction: column;
align-items: center;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid white;
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0 1em;
  padding: 0.25em 1em;
  cursor: pointer;
`;

const OuterCard = styled.div`
    background-color: grey;
    margin: 1rem;
    padding: 1rem 0.5rem 1rem 0.5rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const First = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins', sans-serif;
`;

const Title = styled.h1`
    font-family: 'Poppins', sans-serif;
`;
const Polychromatic = () => {


    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [time, setTime] = useState("loading");
    const [date, setDate] = useState('');
    const [coords, setCoords] = useState({});

    const apiKey = "5RN7lkbb1E4ZmerExI7a0zQxfBbMGlGZCmcpM94s"
    const url = `https://epic.gsfc.nasa.gov/api/natural?&api_key=${apiKey}`

    const getPolychromaticData = async () => {
        const res = await axios.get(url);
        const data = await res.data;
        console.log(data);

        const caption = data[0].caption;
        const date = data[0].date.split(" ")[0];
        const date_formatted = date.replaceAll("-", "/");

        let times = [];
        let images = [];

        for (let i = 0; i < data.length; i++) {
            let time = data[i].date.split(" ")[1];
            let coords = data[i].centroid_coordinates;
            let imageGrabbed = data[i].image;
            let image = `https://epic.gsfc.nasa.gov/archive/natural/${date_formatted}/png/${imageGrabbed}.png`;

            times.push(time);
            images.push({
                image: image,
                time: time,
                coords: coords
            });
        }

        setDate(date);
        setImages(images);

        setImage(images[0].image);
        setTime(times[0]);
        setCoords([images[0].coords.lat, images[0].coords.lon])

        console.log(image);
    }

    useEffect(() => {
        getPolychromaticData();
    }, [])

    return (
        <>
        <Title>
        Polychromatic
        </Title>
            <First>
                <Image src={image} alt={image} width={200} height={200} />
                <div>{time}</div>
                <div>{date}</div>
                <div>{coords[0]}, {coords[1]}</div>
            </First>

            <main className={styles.main}>
                <table>
                    <thead>
                        <TableText>
                            <tr>
                                <th>Time</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Image</th>
                            </tr>
                        </TableText>
                        <tbody>
                            {
                                images.map((e, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <OuterCard>
                                                    <td>
                                                        <TableOuter>
                                                            <td>Time:</td>
                                                            <td>{e.time}</td>
                                                            <td>Latitude:</td>
                                                            <td>{e.coords.lat}</td>
                                                            <td>Longitude:</td>
                                                            <td>{e.coords.lon}</td>
                                                        </TableOuter>
                                                    </td>
                                                    <td>
                                                        <ImageButton>
                                                            <td><Image src={e.image} alt={i} width={200} height={200} /></td>
                                                            <td>
                                                                <Button onClick={() => {
                                                                    setImage(e.image);
                                                                    setTime(e.time);
                                                                    setCoords([e.coords.lat, e.coords.lon]);
                                                                    console.log(images[i].image);
                                                                    document.body.scrollIntoView();
                                                                }}>View</Button>
                                                            </td>
                                                        </ImageButton>
                                                    </td>
                                                </OuterCard>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </thead>
                </table>
            </main>
        </>
    )
}

export default dynamic (() => Promise.resolve(Polychromatic), {ssr: false})
