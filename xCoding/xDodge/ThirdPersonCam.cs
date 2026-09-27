using UnityEngine;

public class ThirdPersonCam : MonoBehaviour {
    public Transform player;

    public float distance = 8f;
    public float height = 5f;

    void Start() {
        bool thirdPersonMode = PlayerPrefs.GetInt("CameraMode", 0) == 1;
        enabled = thirdPersonMode;
    }

    void LateUpdate() {
        if (player == null)
            return;

        Vector3 targetPosition =
            player.position
            - player.forward * distance
            + Vector3.up * height;

        transform.position = targetPosition;

        transform.LookAt(player.position + Vector3.up * 1.5f);
    }
}




/*using UnityEngine;

public class ThirdPersonCam : MonoBehaviour
{
    public Transform player;
    public Vector3 offset = new Vector3(0, 5, -8);
    public Vector3 positionAdjustment = Vector3.zero;
    public Vector3 rotationOffset = Vector3.zero;


    void Start()
    {
        // 플레이어 이동에 따라 카메라가 따라다니도록 설정, 3인칭 모드 여부에 따라 활성화
        bool thirdPersonMode = PlayerPrefs.GetInt("CameraMode", 0) == 1;
        enabled = thirdPersonMode;
    }

    void LateUpdate()
    {
        if (player == null)
        return;

    Vector3 cameraPosition = player.position + offset;

    transform.position = cameraPosition;

    transform.LookAt(player.position + Vector3.up * 1.5f);
    /*
        Vector3 playerForward = new Vector3(player.forward.x, 0, player.forward.z);
        Quaternion playerYRotation = Quaternion.LookRotation(playerForward);

        // 플레이어 기준 회전값을 이용해 카메라 위치를 offset만큼 뒤로 이동
        transform.position = player.position + playerYRotation * offset;
        // 카메라가 플레이어 머리 위쪽을 바라보도록 타겟 위치를 설정
        transform.LookAt(player.position + Vector3.up * 1.2f);
        // 추가적인 회전 보정값을 곱해 최종 카메라 각도를 조정
        transform.rotation *= Quaternion.Euler(rotationOffset);


*/
