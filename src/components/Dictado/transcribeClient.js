import { Buffer } from "buffer";
import MicrophoneStream from "microphone-stream";
//order
import {
  StartStreamTranscriptionCommand,
  TranscribeStreamingClient,
} from "@aws-sdk/client-transcribe-streaming";
import { getCredentials } from "../../services/ExercisesService";

const SAMPLE_RATE = 44100;
const LANGUAGE = "en-US";
let awsID;
let microphoneStream = undefined;
let transcribeClient = undefined;

export const startRecording = async (
  credentials,
  startedCallback,
  callback
) => {
  if (
    (!credentials || Object.keys(credentials).length == 0) &&
    (!awsID || Object.keys(awsID).length <= 1)
  ) {
    console.log("No hay credenciales para transcribe, buscando como admin...");
    const { data } = await getCredentials();
    credentials = { ...data };
    console.log("credenciales obtenidas exitosamente.");
  }

  awsID = { REGION: "us-east-1", ...awsID, ...credentials };

  if (microphoneStream || transcribeClient) {
    await stopRecording();
  }
  createTranscribeClient();
  createMicrophoneStream();
  await startStreaming(startedCallback, callback);
};

export const stopRecording = async function () {
  if (microphoneStream) {
    await microphoneStream.stop();
    await microphoneStream.destroy();
    microphoneStream = undefined;
  }
  if (transcribeClient) {
    await transcribeClient.destroy();
    transcribeClient = undefined;
  }
};

const createTranscribeClient = () => {
  transcribeClient = new TranscribeStreamingClient({
    region: awsID.REGION,
    credentials: { ...awsID },
  });
};

const createMicrophoneStream = async () => {
  microphoneStream = new MicrophoneStream();
  const stream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  microphoneStream.setStream(stream);
};

const startStreaming = async (startedCallback, callback) => {
  const command = new StartStreamTranscriptionCommand({
    LanguageCode: LANGUAGE,
    MediaEncoding: "pcm",
    MediaSampleRateHertz: SAMPLE_RATE,
    AudioStream: getAudioStream(),
  });
  const data = await transcribeClient.send(command);
  startedCallback();
  for await (const event of data.TranscriptResultStream) {
    for (const result of event.TranscriptEvent.Transcript.Results || []) {
      if (result.IsPartial === false) {
        const noOfResults = result.Alternatives[0].Items.length;
        for (let i = 0; i < noOfResults; i++) {
          callback(result.Alternatives[0].Items[i].Content + " ");
        }
      }
    }
  }
};

const getAudioStream = async function* () {
  for await (const chunk of microphoneStream) {
    if (chunk.length <= SAMPLE_RATE) {
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(chunk),
        },
      };
    }
  }
};

const encodePCMChunk = (chunk) => {
  const input = MicrophoneStream.toRaw(chunk);
  let offset = 0;
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return Buffer.from(buffer);
};
