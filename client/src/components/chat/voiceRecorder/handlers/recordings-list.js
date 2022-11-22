export function deleteAudio(audioKey, recordings, setRecordings) {
  setRecordings((prevState) =>
    prevState.filter((record) => record.key !== audioKey)
  );
  // const newRecording = { ...recordings };
  // delete newRecording.audio;
  // delete newRecording.key;
  // setRecordings(newRecording);
}
