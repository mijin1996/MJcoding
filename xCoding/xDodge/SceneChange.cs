using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneChange : MonoBehaviour {
    /*
    public void StartFixedMode()
    {
        // 고정 카메라 모드 선택
        PlayerPrefs.SetInt("CameraMode", 0);
        // 씬 번호 1로 이동
        SceneManager.LoadScene(1);
    }

    public void StartThirdPersonMode()
    {
        // 3인칭 카메라 모드 선택
        PlayerPrefs.SetInt("CameraMode", 1);
        // 씬 번호 1로 이동
        SceneManager.LoadScene(1);
    }

    public void Change(int Index)
    {
        // 전달된 인덱스 씬 불러오기
        SceneManager.LoadScene(Index);
    }
*/

    public void StartFixedMode() {
        SceneManager.LoadScene("fixedscene");
    }

    public void StartThirdPersonMode() {
        SceneManager.LoadScene("3rdscene");
    }

    public void RestartCurrentScene() {
        // 현재 활성 씬을 다시 로드
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }

    public void GoHome() {
        SceneManager.LoadScene("Introscene");
    }
}
