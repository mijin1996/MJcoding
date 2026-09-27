using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;


public class SceneChange : MonoBehaviour {
    public AudioSource audioSource;


    public void ChangeScene(int index) {
        StartCoroutine(ChangeSceneRoutine(index)); //StartCoroutine :: “이 함수를 바로 끝까지 실행하지 말고, 중간에 기다리면서 천천히 실행해줘” 라는 뜻입니다.

        //SceneManager.LoadScene(index);

    }

    IEnumerator ChangeSceneRoutine(int index) { // 코루틴을 사용하여 씬 전환 전에 소리를 재생하고 일정 시간 대기 후 씬을 전환
        audioSource.PlayOneShot(audioSource.clip);

        yield return new WaitForSeconds(1f);

        SceneManager.LoadScene(index);
    }

    // 현재 씬 재시작
    public void RestartScene(int index) {
        SceneManager.LoadScene(index);
    }

    public void HomeButton(int index) {
        SceneManager.LoadScene(index);
    }
}
