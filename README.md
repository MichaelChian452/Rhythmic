# Rhythmic
## Table of Contents
[General Information](#general-information)

[Key Characteristics](#key-characteristics)

[Technologies Used](#technologies-used)

[Other Works Used](#other-work-used)


## General Information
This project is a tool to help piano players determine mistakes without the need for a teacher. Users can easily upload sheet music and recordings onto a web application and see where they made a mistake in their playing. 

Rhythmic makes use of MusicXML to store parsed sheet music along with parsed recordings.

The web app was also deployed to AWS through the AWS [ECR](https://aws.amazon.com/ecr/) and [ECS](https://aws.amazon.com/ecs/) service. 

Architecture Design Diagram: 
![image](https://github.com/MichaelChian452/Rhythmic/assets/43621839/7be9caf1-8abb-4472-ad73-8d1de7277d29)

## Key Characteristics
- Pictures of sheet music are parsed using Audiveris' OMR engine and stored in MusicXML. 
- Recordings of their playing are transcribed using Omnizart to convert into MIDI and finally MuseScore to convert from MIDI to MusicXML.
- Employing a Levenshtein Distance algorithm, Rhythmic will determine the mistakes made by the pianist. 
- Simple user interface to enable a smooth experience.
- Most modules are packaged into Docker containers.

## Technologies Used
- Python 3.11.4
- Next.js 13.4.5
- Docker 20.10.21

## Other Work Used
- [Audiveris 5.3](https://github.com/Audiveris/audiveris)
- [Omnizart 0.5.0](https://github.com/Music-and-Culture-Technology-Lab/omnizart)
- [MuseScore](https://github.com/musescore/MuseScore)
